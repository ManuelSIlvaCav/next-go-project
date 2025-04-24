package config

import (
	"fmt"
	"strings"

	"github.com/knadh/koanf/providers/env"
	"github.com/knadh/koanf/v2"
)

type Postgres struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
}

type Redis struct {
	Host     string
	Port     int
	Username string
	Password string
}

type Resend struct {
	ApiKey string
}

type Vercel struct {
	ProjectId string
	AuthToken string
}

type Config struct {
	Env      string
	Port     int
	Postgres Postgres
	Redis    Redis
	Resend   Resend
	Vercel
}

func NewConfig() *Config {
	k := koanf.New(".")

	k.Load(env.Provider("", ".", func(s string) string {
		return strings.Replace(strings.ToLower(
			strings.TrimPrefix(s, "")), "_", ".", -1)
	}), nil)

	newConfig := &Config{
		Env:  k.String("env"),
		Port: k.Int("port"),
		Postgres: Postgres{
			Host:     k.String("postgres.host"),
			Port:     k.Int("postgres.port"),
			User:     k.String("postgres.user"),
			Password: k.String("postgres.password"),
			DBName:   k.String("postgres.db"),
		},
		Redis: Redis{
			Host:     k.String("redis.host"),
			Port:     k.Int("redis.port"),
			Username: k.String("redis.user"),
			Password: k.String("redis.password"),
		},
		Resend: Resend{
			ApiKey: k.String("resend.apikey"),
		},
		Vercel: Vercel{
			ProjectId: k.String("vercel.projectid"),
			AuthToken: k.String("vercel.token"),
		},
	}

	return newConfig
}

func (c *Config) IsDevelopment() bool {
	return c.Env == "development" || c.Env == "local"
}

func (c *Config) IsProduction() bool {
	return c.Env == "production"
}

func (c *Config) RedisURL() string {
	return fmt.Sprintf(
		"%s:%s@%s:%d",
		c.Redis.Username,
		c.Redis.Password,
		c.Redis.Host,
		c.Redis.Port,
	)
}

func (c *Config) PostgresURL() string {
	dbURL := fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s?sslmode=disable",
		c.Postgres.User,
		c.Postgres.Password,
		c.Postgres.Host,
		c.Postgres.Port,
		c.Postgres.DBName,
	)
	return dbURL
}
