package sellers_repositories

import (
	"context"
	"encoding/json"
	"fmt"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	sellers_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/sellers/models"
)

type SellerListingRepository struct {
	container *container.Container
}

func NewSellerListingRepository(container *container.Container) *SellerListingRepository {
	return &SellerListingRepository{
		container: container,
	}
}

func (r *SellerListingRepository) CreateSellerListing(
	ctx context.Context,
	listing *sellers_models.SellerListing,
	details *sellers_models.SellerListingDetails,
	prices []sellers_models.PriceInput,
	categories []int,
) (*sellers_models.SellerListingDTO, error) {
	logger := r.container.Logger()

	// Start a transaction
	tx, err := r.container.DB().Db.BeginTx(ctx, nil)
	if err != nil {
		logger.Error("Error starting transaction", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}
	defer tx.Rollback()

	// Insert seller listing
	listingQuery := `
		INSERT INTO seller_listings (seller_id, business_id, type_id) 
		VALUES ($1, $2, $3) 
		RETURNING id, created_at, updated_at`

	err = tx.QueryRowContext(ctx, listingQuery,
		listing.SellerID,
		listing.BusinessID,
		listing.TypeID,
	).Scan(&listing.ID, &listing.CreatedAt, &listing.UpdatedAt)

	if err != nil {
		logger.Error("Error creating seller listing", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	// Insert seller listing details
	metadataJSON, err := json.Marshal(details.Metadata)
	if err != nil {
		logger.Error("Error marshaling metadata", "error", err)
		metadataJSON = []byte("{}")
	}

	detailsQuery := `
		INSERT INTO seller_listings_details (seller_listing_id, title, description, currency, metadata) 
		VALUES ($1, $2, $3, $4, $5) 
		RETURNING id`

	err = tx.QueryRowContext(ctx, detailsQuery,
		listing.ID,
		details.Title,
		details.Description,
		details.Currency,
		metadataJSON,
	).Scan(&details.ID)

	if err != nil {
		logger.Error("Error creating seller listing details", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	// Insert prices
	priceModels := []sellers_models.SellerListingPrice{}
	for _, priceInput := range prices {
		priceQuery := `
			INSERT INTO seller_listings_prices (seller_listing_id, amount, currency, interval) 
			VALUES ($1, $2, $3, $4) 
			RETURNING id, created_at, updated_at`

		var price sellers_models.SellerListingPrice
		err = tx.QueryRowContext(ctx, priceQuery,
			listing.ID,
			priceInput.Amount,
			priceInput.Currency,
			priceInput.Interval,
		).Scan(&price.ID, &price.CreatedAt, &price.UpdatedAt)

		if err != nil {
			logger.Error("Error creating seller listing price", "error", err)
			return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
		}

		price.SellerListingID = listing.ID
		price.Amount = priceInput.Amount
		price.Currency = priceInput.Currency
		price.Interval = priceInput.Interval
		priceModels = append(priceModels, price)
	}

	// Insert categories
	if len(categories) > 0 {
		for _, categoryID := range categories {
			categoryQuery := `
				INSERT INTO seller_listings_categories (seller_listing_id, category_id) 
				VALUES ($1, $2)`

			_, err = tx.ExecContext(ctx, categoryQuery, listing.ID, categoryID)
			if err != nil {
				logger.Error("Error creating seller listing category", "error", err, "category_id", categoryID)
				// Continue even if category insertion fails (category might not exist)
			}
		}
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		logger.Error("Error committing transaction", "error", err)
		return nil, internal_models.NewErrorWithCode(internal_models.UserCreationError)
	}

	// Get type name
	typeName := "service"
	if listing.TypeID == 2 {
		typeName = "product"
	}

	// Build DTO
	dto := &sellers_models.SellerListingDTO{
		ID:          listing.ID,
		SellerID:    listing.SellerID,
		BusinessID:  listing.BusinessID,
		Type:        typeName,
		TypeID:      listing.TypeID,
		Title:       details.Title,
		Description: details.Description,
		Currency:    details.Currency,
		Metadata:    details.Metadata,
		Prices:      priceModels,
		Categories:  categories,
		CreatedAt:   listing.CreatedAt,
		UpdatedAt:   listing.UpdatedAt,
	}

	return dto, nil
}

func (r *SellerListingRepository) GetSellerListings(
	ctx context.Context,
	params *sellers_models.GetSellerListingsParams,
) (*sellers_models.PaginatedSellerListingsResponse, error) {
	logger := r.container.Logger()

	// Set default limit
	if params.Limit <= 0 {
		params.Limit = 10
	}
	if params.Limit > 100 {
		params.Limit = 100
	}

	// Build base query with joins
	baseQuery := `
		FROM seller_listings sl
		INNER JOIN seller_listings_details sld ON sl.id = sld.seller_listing_id
		INNER JOIN seller_listings_type slt ON sl.type_id = slt.id
		WHERE 1=1`

	queryArgs := []interface{}{}
	argIndex := 1

	// Add optional filters
	if params.SellerID != "" {
		baseQuery += fmt.Sprintf(" AND sl.seller_id = $%d", argIndex)
		queryArgs = append(queryArgs, params.SellerID)
		argIndex++
	}

	if params.BusinessID > 0 {
		baseQuery += fmt.Sprintf(" AND sl.business_id = $%d", argIndex)
		queryArgs = append(queryArgs, params.BusinessID)
		argIndex++
	}

	if params.TypeID > 0 {
		baseQuery += fmt.Sprintf(" AND sl.type_id = $%d", argIndex)
		queryArgs = append(queryArgs, params.TypeID)
		argIndex++
	}

	if params.CategoryID > 0 {
		baseQuery += fmt.Sprintf(` AND EXISTS (
			SELECT 1 FROM seller_listings_categories slc 
			WHERE slc.seller_listing_id = sl.id 
			AND slc.category_id = $%d
		)`, argIndex)
		queryArgs = append(queryArgs, params.CategoryID)
		argIndex++
	}

	// Get total count
	countQuery := "SELECT COUNT(*) " + baseQuery
	var total int
	err := r.container.DB().Db.QueryRowContext(ctx, countQuery, queryArgs...).Scan(&total)
	if err != nil {
		logger.Error("Error counting seller listings", "error", err)
		return nil, err
	}

	// Get listings
	listingsQuery := `
		SELECT 
			sl.id, sl.seller_id, sl.business_id, sl.type_id, slt.name as type_name,
			sld.title, sld.description, sld.currency, sld.metadata,
			sl.created_at, sl.updated_at
		` + baseQuery + `
		ORDER BY sl.created_at DESC
		LIMIT $` + fmt.Sprintf("%d", argIndex) + ` OFFSET $` + fmt.Sprintf("%d", argIndex+1)

	queryArgs = append(queryArgs, params.Limit, params.Offset)

	rows, err := r.container.DB().Db.QueryContext(ctx, listingsQuery, queryArgs...)
	if err != nil {
		logger.Error("Error querying seller listings", "error", err)
		return nil, err
	}
	defer rows.Close()

	listings := []sellers_models.SellerListingDTO{}
	listingIDs := []string{}

	for rows.Next() {
		var dto sellers_models.SellerListingDTO
		var metadataJSON []byte

		err := rows.Scan(
			&dto.ID,
			&dto.SellerID,
			&dto.BusinessID,
			&dto.TypeID,
			&dto.Type,
			&dto.Title,
			&dto.Description,
			&dto.Currency,
			&metadataJSON,
			&dto.CreatedAt,
			&dto.UpdatedAt,
		)

		if err != nil {
			logger.Error("Error scanning seller listing", "error", err)
			continue
		}

		// Unmarshal metadata
		if len(metadataJSON) > 0 {
			var metadata map[string]any
			if err := json.Unmarshal(metadataJSON, &metadata); err == nil {
				dto.Metadata = metadata
			}
		}

		listings = append(listings, dto)
		listingIDs = append(listingIDs, dto.ID)
	}

	// Fetch prices for all listings
	if len(listingIDs) > 0 {
		pricesMap, err := r.getListingPrices(ctx, listingIDs)
		if err != nil {
			logger.Error("Error fetching listing prices", "error", err)
		} else {
			for i := range listings {
				if prices, ok := pricesMap[listings[i].ID]; ok {
					listings[i].Prices = prices
				}
			}
		}

		// Fetch categories for all listings
		categoriesMap, err := r.getListingCategories(ctx, listingIDs)
		if err != nil {
			logger.Error("Error fetching listing categories", "error", err)
		} else {
			for i := range listings {
				if categories, ok := categoriesMap[listings[i].ID]; ok {
					listings[i].Categories = categories
				}
			}
		}
	}

	hasMore := params.Offset+params.Limit < total

	return &sellers_models.PaginatedSellerListingsResponse{
		Listings: listings,
		Total:    total,
		Limit:    params.Limit,
		Offset:   params.Offset,
		HasMore:  hasMore,
	}, nil
}

func (r *SellerListingRepository) getListingPrices(ctx context.Context, listingIDs []string) (map[string][]sellers_models.SellerListingPrice, error) {
	logger := r.container.Logger()

	if len(listingIDs) == 0 {
		return map[string][]sellers_models.SellerListingPrice{}, nil
	}

	query := `
		SELECT id, seller_listing_id, amount, currency, interval, created_at, updated_at
		FROM seller_listings_prices
		WHERE seller_listing_id = ANY($1)
		ORDER BY seller_listing_id, created_at DESC`

	rows, err := r.container.DB().Db.QueryContext(ctx, query, listingIDs)
	if err != nil {
		logger.Error("Error querying listing prices", "error", err)
		return nil, err
	}
	defer rows.Close()

	pricesMap := make(map[string][]sellers_models.SellerListingPrice)

	for rows.Next() {
		var price sellers_models.SellerListingPrice
		err := rows.Scan(
			&price.ID,
			&price.SellerListingID,
			&price.Amount,
			&price.Currency,
			&price.Interval,
			&price.CreatedAt,
			&price.UpdatedAt,
		)

		if err != nil {
			logger.Error("Error scanning price", "error", err)
			continue
		}

		pricesMap[price.SellerListingID] = append(pricesMap[price.SellerListingID], price)
	}

	return pricesMap, nil
}

func (r *SellerListingRepository) getListingCategories(ctx context.Context, listingIDs []string) (map[string][]int, error) {
	logger := r.container.Logger()

	if len(listingIDs) == 0 {
		return map[string][]int{}, nil
	}

	query := `
		SELECT seller_listing_id, category_id
		FROM seller_listings_categories
		WHERE seller_listing_id = ANY($1)`

	rows, err := r.container.DB().Db.QueryContext(ctx, query, listingIDs)
	if err != nil {
		logger.Error("Error querying listing categories", "error", err)
		return nil, err
	}
	defer rows.Close()

	categoriesMap := make(map[string][]int)

	for rows.Next() {
		var listingID string
		var categoryID int
		err := rows.Scan(&listingID, &categoryID)

		if err != nil {
			logger.Error("Error scanning category", "error", err)
			continue
		}

		categoriesMap[listingID] = append(categoriesMap[listingID], categoryID)
	}

	return categoriesMap, nil
}
