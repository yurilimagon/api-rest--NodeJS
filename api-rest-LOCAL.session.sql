create table if not exists imagens_produtos (
	id_imagem int not null primary key AUTO_INCREMENT,
    id_produto int,
    caminho varchar(255),
    foreign key (id_produto) references produtos (idprodutos)
)

select * from imagens_produtos;