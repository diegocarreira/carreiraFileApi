# API para salvar e buscar imagens e outros arquivos, para utilizar em diferentes projetos.
*API to save and serve images and other files of the yours projects, keeping this files separated of the principal project.*

###Because:###
####Trabalhar com arquivos e imagens externas para favarocer a performance e segurança das aplicações que o utilizarem.
*Working with external files and images to favarocer performance and security of applications that use it.*

# Esse projeto utiliza as tecnologias:
- [NodeJS](http://nodejs.org)
- [MongoDB](http://www.mongodb.org)
- [LoopBack](http://loopback.io)


# Para rodar o projeto:

- Colocar o projeto em um servidor Web (ou servidor local)
- Instalar o Node.JS e o MongoDB
- instalar as dependências do arquivo package.js -> `npm install`
- Ser feliz!

# Metodos:

## Salvar imagem: [POST] ## `{{url_do_servidor}}/api/containers/images/upload`

### parâmetros:


file -> (arquivo de imagem)

description -> (comentario sobre a imagem)

### exemplo de retorno:
```
{
    "result": "51e4b4ade34b1178a14dec12"
}
```

---

## Buscar imagem: [GET] ## `{{url_do_servidor}}/api/images/{{id_da_imagem_retornado_no_metodo_acima}}`

### tipo de retorno (mimetype): ```image\jpeg``` ou ```image\png``` ou ```image\gif```

---

## Salvar documento: [POST]

`{{url_do_servidor}}/api/containers/documents/upload`

### parâmetros:


file -> (arquivo de tipo doc, ou pdf , etc..)

description -> (comentario sobre o arquivo)

### exemplo de retorno:
```
{
    "result": "51e4b4ade34b1178a14dec12"
}
```

---

## Buscar documento: [GET] ## `{{url_do_servidor}}/api/documents/{{id_do_doc_retornado_no_metodo_acima}}`

### tipo de retorno: ```arquivo será baixado automaticamente```

---

#Observações:
Os arquivos por padrão ficam salvos no diretorio **/server/storage/{{nome_do_container}}/{{id_do_arquivo}}.{{extensao}}**
