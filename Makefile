.PHONY: help setup dev up down logs clean rebuild

help: ## Mostra esta ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Configuração inicial - cria arquivo .env
	@echo "🔧 Configurando projeto..."
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ Arquivo .env criado! Por favor, edite-o com suas chaves Stripe."; \
	else \
		echo "ℹ️  Arquivo .env já existe."; \
	fi
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env; \
		echo "✅ Arquivo backend/.env criado!"; \
	fi
	@echo "📝 Próximo passo: Edite os arquivos .env com suas chaves Stripe"
	@echo "   Obtenha em: https://dashboard.stripe.com/test/apikeys"

dev: ## Inicia ambiente de desenvolvimento
	@echo "🚀 Iniciando ambiente de desenvolvimento..."
	docker-compose up --build

up: ## Inicia containers em background
	@echo "🚀 Iniciando containers..."
	docker-compose up -d
	@echo "✅ Containers iniciados!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:3001"

down: ## Para todos os containers
	@echo "🛑 Parando containers..."
	docker-compose down
	@echo "✅ Containers parados!"

logs: ## Mostra logs dos containers
	docker-compose logs -f

logs-backend: ## Mostra logs do backend
	docker-compose logs -f backend

logs-frontend: ## Mostra logs do frontend
	docker-compose logs -f frontend

clean: ## Remove containers, volumes e imagens
	@echo "🧹 Limpando ambiente Docker..."
	docker-compose down -v --rmi all
	@echo "✅ Ambiente limpo!"

rebuild: ## Reconstrói e reinicia containers
	@echo "🔄 Reconstruindo containers..."
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	@echo "✅ Containers reconstruídos!"

restart: ## Reinicia containers
	@echo "🔄 Reiniciando containers..."
	docker-compose restart
	@echo "✅ Containers reiniciados!"

shell-backend: ## Abre shell no container do backend
	docker-compose exec backend sh

shell-frontend: ## Abre shell no container do frontend
	docker-compose exec frontend sh

install: ## Instala dependências em ambos os projetos
	@echo "📦 Instalando dependências..."
	cd backend && npm install
	cd frontend && npm install
	@echo "✅ Dependências instaladas!"

prod: ## Inicia ambiente de produção
	@echo "🚀 Iniciando ambiente de produção..."
	docker-compose -f docker-compose.prod.yml up --build -d
	@echo "✅ Ambiente de produção iniciado!"

prod-down: ## Para ambiente de produção
	docker-compose -f docker-compose.prod.yml down

status: ## Mostra status dos containers
	@docker-compose ps

test: ## Verifica se os serviços estão funcionando
	@echo "🧪 Testando serviços..."
	@curl -s http://localhost:3001 > /dev/null && echo "✅ Backend: OK" || echo "❌ Backend: ERRO"
	@curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend: OK" || echo "❌ Frontend: ERRO"

