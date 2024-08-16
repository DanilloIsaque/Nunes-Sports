
package br.com.api.produtos.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
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
    
    public MensagemDTO excluirProduto(Long id) {
        MensagemDTO mensagem = new MensagemDTO();
        Optional<Produto> optionalProduto = dao.findById(id);
            Produto produto = optionalProduto.get();
            dao.delete(produto);
            mensagem.setMensagem("Produto excluído com sucesso.");
    
        return mensagem;
    }

    public List<Produto> listarProdutos() {
        return dao.findAll();
    }

    
}
