import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.produtos.Model.DTO.ProdutoDTO;

@RestController
@RequestMapping("/produto")
public class ProdutosController {
    
    @Autowired
    private ProdutosService produtoService;

    @PostMapping("/salvar")
    public ResponseEntity<Void> salvar(@RequestBody ProdutoDTO dto, @RequestParam Boolean isAlterar) {
        service.salvar(dto, isAlterar);
        return ResponseEntity.ok().build(); // Retorna apenas HttpStatus.OK sem corpo de resposta
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Produtos>> listarProdutos() {
   
        List<Produtos> produtos = service.listarProdutos();
        return ResponseEntity.ok(produtos);
    }
        @DeleteMapping("/excluir")
        public ResponseEntity<MensagemDTO> excluir(@RequestParam Integer id) {
            MensagemDTO mensagem = service.excluirBloco(id);
            return new ResponseEntity<>(mensagem, mensagem.getMensagem().equals("Bloco Excluído com sucesso.") ? HttpStatus.NO_CONTENT : HttpStatus.NOT_FOUND);
        }
    
    
}
