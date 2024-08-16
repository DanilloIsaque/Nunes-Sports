import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.api.produtos.Model.Produto;
import br.com.api.produtos.Model.DTO.MensagemDTO;
import br.com.api.produtos.Model.DTO.ProdutoDTO;

@Service
public class ProdutoService {

    @Autowired
    private ProdutosDAO dao;

    public MensagemDTO salvar(ProdutoDTO dto) {
        MensagemDTO mensagem = new MensagemDTO();
        Produto produto;

        if (dto.getCodigo() != null) {
            
            produto = produtoRepository.findById(dto.getCodigo())
                .orElse(new Produto()); 
        }

        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());

        dao.save(produto);
        mensagem.setMensagem("Produto salvo com sucesso.");
        return mensagem;
    }
    
    public MensagemDTO excluirProduto(Integer id) {
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
