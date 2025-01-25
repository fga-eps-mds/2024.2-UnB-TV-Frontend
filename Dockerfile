# Etapa 1: Base para construção do projeto Angular
FROM node:20 as angular

# Define o diretório de trabalho
WORKDIR /unb-tv-web

# Instala Chromium e outras dependências necessárias
RUN apt-get update && \
    apt-get install -y chromium && \
    rm -rf /var/lib/apt/lists/*

# Define a variável de ambiente para o Chromium
ENV CHROME_BIN=/usr/bin/chromium

# Define o PATH para o Angular CLI
ENV PATH /unb-tv-web/node_modules/.bin:$PATH

# Define o ambiente como desenvolvimento
ENV NODE_ENV=dev

# Copia apenas o package.json e package-lock.json para otimizar cache
COPY package.json package-lock.json ./

# Instala o Angular CLI globalmente e as dependências do projeto
RUN npm install -g @angular/cli && \
    npm install

# Copia todo o código para o contêiner
COPY . .

# Exponha as portas necessárias
EXPOSE 4200 9876

# Comando padrão para iniciar o servidor de desenvolvimento Angular
CMD ["ng", "serve", "--host", "0.0.0.0"]
