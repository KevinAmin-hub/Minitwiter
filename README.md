# Mini Twitter API (scaffold)

API simples em Node.js + Express criada como scaffold para o projeto "Rede Social".

Endpoints:
- GET / -> status
- GET /posts -> lista de posts (in-memory)
- POST /posts -> criar post { author, text }

Como usar (Windows PowerShell):

1. Instalar dependências

```powershell
cd "C:\Users\kevin_portillo\Desktop\Mini twiter"
npm install
```

2. Rodar localmente

```powershell
npm start
# ou para desenvolvimento com reload automático
npm run dev
```

3. Testar rapidamente (PowerShell):

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:3000/ | Select-Object -ExpandProperty Content
```

Instruções para criar e enviar ao GitHub (exemplo):

```powershell
cd "C:\Users\kevin_portillo\Desktop\Mini twiter"
git remote add origin https://github.com/<seu-usuario>/<nome-do-repo>.git
git branch -M main
git push -u origin main
```

Substitua `<seu-usuario>` e `<nome-do-repo>` pelos seus dados.

Configurar MySQL (opcional - para persistência)

1. Crie um banco MySQL ou use o arquivo `sql/create_tables.sql` (pode rodar no cliente mysql):

```powershell
# Exemplo usando o cliente mysql (ajuste usuário/host/porta)
mysql -u root -p < sql/create_tables.sql
```

2. Crie um `.env` na raiz com as variáveis (ou copie `.env.example`):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha
DB_NAME=mini_twitter
DB_PORT=3306
PORT=3000
```

3. Inicie a API (ela criará a tabela `posts` automaticamente caso não exista):

```powershell
npm start
```
