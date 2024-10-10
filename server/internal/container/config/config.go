package config

import (
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

type Config struct {
	Env      string
	Port     int
	Postgres Postgres
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
	}

	return newConfig
}
