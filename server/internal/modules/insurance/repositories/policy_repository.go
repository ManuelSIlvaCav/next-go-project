package insurance_repository

import (
	"context"
	"fmt"
	"math/rand"

	internal_models "github.com/ManuelSIlvaCav/next-go-project/server/internal/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/container"
	insurance_modules "github.com/ManuelSIlvaCav/next-go-project/server/internal/modules/insurance/models"
	"github.com/ManuelSIlvaCav/next-go-project/server/internal/utils"
	"github.com/jackc/pgx/v5/pgconn"
)

func generatePolicyNumber() string {
	return fmt.Sprintf("POL-%d", rand.Intn(90000000)+10000000)
}

type PolicyRepository struct {
	container *container.Container
	utils.BaseRepository[insurance_modules.Policy]
}

func NewPolicyRepository(container *container.Container) *PolicyRepository {
	return &PolicyRepository{
		container:      container,
		BaseRepository: *utils.NewBaseRepository[insurance_modules.Policy](container),
	}
}

func (r *PolicyRepository) CreatePolicy(ctx context.Context,
	params *insurance_modules.PolicyCreateParams) (*insurance_modules.Policy, *internal_models.HandlerError) {
	logger := r.container.Logger()

	policyNumber := generatePolicyNumber()

	newPolicy := &insurance_modules.Policy{
		DisplayName:  params.DisplayName,
		PolicyNumber: policyNumber,
	}

	query := `INSERT INTO ins_policies (display_name, policy_number) VALUES ($1, $2) RETURNING id, policy_number, created_at, updated_at`

	if err := r.container.DB().Db.QueryRowContext(ctx, query,
		newPolicy.DisplayName,
		policyNumber,
	).Scan(&newPolicy.ID, &newPolicy.PolicyNumber, &newPolicy.CreatedAt, &newPolicy.UpdatedAt); err != nil {
		pqErr := err.(*pgconn.PgError)
		// Handle foreign key violation
		logger.Error("Error creating policy", "code", pqErr.Code, "error", err, "newPolicy", newPolicy, "pqErr", pqErr)
		if pqErr.Code == "23502" {
			return nil, internal_models.NewErrorWithCode(internal_models.PolicyFormatError)
		}
		return nil, internal_models.NewErrorWithCode(internal_models.PolicyFormatError)
	}

	return newPolicy, nil
}

func (r *PolicyRepository) CreatePolicyVariant(ctx context.Context,
	params *insurance_modules.PolicyVariantCreateParams) (*insurance_modules.PolicyVariant, error) {
	logger := r.container.Logger()

	newPolicyVariant := &insurance_modules.PolicyVariant{
		PolicyID:    params.PolicyID,
		DisplayName: params.DisplayName,
		Excess:      params.Excess,
		Copay:       params.Copay,
		PayoutLimit: params.PayoutLimit,
		Currency:    params.Currency,
	}

	query := `INSERT INTO ins_policy_variants (policy_id, display_name, excess, copay, payout_limit, currency) 
			  VALUES ($1, $2, $3, $4, $5, $6) 
			  RETURNING id, created_at, updated_at`

	if err := r.container.DB().Db.QueryRowContext(ctx, query,
		newPolicyVariant.PolicyID,
		newPolicyVariant.DisplayName,
		newPolicyVariant.Excess,
		newPolicyVariant.Copay,
		newPolicyVariant.PayoutLimit,
		newPolicyVariant.Currency,
	).Scan(&newPolicyVariant.ID, &newPolicyVariant.CreatedAt, &newPolicyVariant.UpdatedAt); err != nil {
		pqErr := err.(*pgconn.PgError)
		logger.Error("Error creating policy variant", "errorCode", pqErr.Code, "error", err, "params", params, "pqErr", pqErr)
		/* Constraint error */
		if pqErr.Code == "23514" {
			return nil, fmt.Errorf("policy variant validation error: %v", pqErr.Message)
		}
		return nil, err
	}

	return newPolicyVariant, nil
}

func (r *PolicyRepository) GetPolicies(ctx context.Context) (*insurance_modules.GetPoliciesDTO, error) {
	logger := r.container.Logger()

	/* Map whereby the key is the policyID  and contains the Policy Info and the variants*/
	policyVariantMap := map[string]*insurance_modules.GetPolicyDTO{}

	policyQuery := `SELECT p.id, p.policy_number, p.display_name, p.created_at, p.updated_at, pv.id, pv.display_name, pv.excess, pv.copay, pv.payout_limit, pv.currency FROM ins_policies p INNER JOIN ins_policy_variants pv ON p.id = pv.policy_id ORDER BY p.created_at DESC`

	rows, err := r.container.DB().Db.QueryxContext(ctx, policyQuery)
	if err != nil {
		logger.Error("Error getting policies", "error", err)
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var policy insurance_modules.Policy
		var variant insurance_modules.PolicyVariant
		if err := rows.Scan(&policy.ID, &policy.PolicyNumber, &policy.DisplayName, &policy.CreatedAt, &policy.UpdatedAt, &variant.ID, &variant.DisplayName, &variant.Excess, &variant.Copay, &variant.PayoutLimit, &variant.Currency); err != nil {
			logger.Error("Failed to scan policy", "error", err)
			return nil, err
		}
		if _, exists := policyVariantMap[policy.ID]; !exists {
			policyVariantMap[policy.ID] = &insurance_modules.GetPolicyDTO{
				Policy:         &policy,
				PolicyVariants: []*insurance_modules.PolicyVariant{&variant},
			}
		} else {
			entry := policyVariantMap[policy.ID]
			entry.PolicyVariants = append(entry.PolicyVariants, &variant)
			policyVariantMap[policy.ID] = entry
		}
	}

	policiesDTO := make([]*insurance_modules.GetPolicyDTO, 0, len(policyVariantMap))
	for _, entry := range policyVariantMap {
		policiesDTO = append(policiesDTO, entry)
	}

	return &insurance_modules.GetPoliciesDTO{
		Policies: policiesDTO,
	}, nil
}
