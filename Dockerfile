# Etapa 1: Base para construção do projeto Angular
FROM node:20 as angular

# Define o diretório de trabalho
WORKDIR /unb-tv-web

# Instala Chromium e outras dependências necessárias
RUN apt-get update 
RUN apt-get -y install chromium 

# Define a variável de ambiente para o Chromium
ENV CHROME_BIN=/usr/bin/chromium

# Define o PATH para o Angular CLI
ENV PATH /unb-tv-web/node_modules/.bin:$PATH

# Define o ambiente como desenvolvimento
ENV NODE_ENV=dev

# Install dependencies
COPY package.json /unb-tv-web/

# Instala o Angular CLI globalmente e as dependências do projeto
RUN npm install -g @angular/cli 
RUN npm install

COPY . /unb-tv-web

# Exponha as portas necessárias
EXPOSE 4200
EXPOSE 9876

# Comando padrão para iniciar o servidor de desenvolvimento Angular
CMD ["ng", "serve", "--host", "0.0.0.0"]
