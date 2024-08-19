package br.com.api.produtos.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="produtos")
@NoArgsConstructor
public class Produto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="codigo_do_produto")
    private Integer codigo;

    @Column(name="nome_do_produto")
    private String nome;

    @Column(name="descricao_do_produto")
    private String descricao;

    @Column(name="preco_do_produto")
    private Double preco;

}
