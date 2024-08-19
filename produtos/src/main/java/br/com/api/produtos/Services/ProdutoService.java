
package br.com.api.produtos.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import br.com.api.produtos.DAO.ProdutoDAO;
import br.com.api.produtos.Model.Produto;
import br.com.api.produtos.Model.DTO.MensagemDTO;
import br.com.api.produtos.Model.DTO.ProdutoDTO;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoDAO dao;

    public MensagemDTO salvar(ProdutoDTO dto) {
        MensagemDTO mensagem = new MensagemDTO();
        Produto produto = new Produto();

        if (dto.getCodigo() != null) {
            
            produto = dao.findById(dto.getCodigo())
                .orElse(new Produto()); 
        }

        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());

        dao.save(produto);
        mensagem.setMensagem("Produto salvo com sucesso.");
        return mensagem;
    }
    
    public MensagemDTO excluirProduto(Integer codigo) {
       Produto produto = dao.findById(codigo)
        .orElseThrow(() -> new NoSuchElementException("Produto não encontrado com o código " + codigo));
    dao.delete(produto);
    return new MensagemDTO("Produto Excluído com sucesso.", null);
    }

    public List<Produto> listarProdutos() {
        return dao.findAll();
    }

    
}
