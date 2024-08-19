package br.com.api.produtos.Controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.api.produtos.Model.Produto;
import br.com.api.produtos.Model.DTO.MensagemDTO;
import br.com.api.produtos.Model.DTO.ProdutoDTO;
import br.com.api.produtos.Services.ProdutoService;

@RestController
@RequestMapping("/produto")
public class ProdutosController {
    
    @Autowired
    private ProdutoService service;

    @PostMapping("/salvar")
    public ResponseEntity<Void> salvar(@RequestBody ProdutoDTO dto) {
        service.salvar(dto);
        return ResponseEntity.ok().build(); // Retorna apenas HttpStatus.OK sem corpo de resposta
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Produto>> listarProdutos() {
   
        List<Produto> produtos = service.listarProdutos();
        return ResponseEntity.ok(produtos);
    }
        @DeleteMapping("/excluir")
        public ResponseEntity<MensagemDTO> excluir(@RequestParam Integer codigo) {
    try {
        MensagemDTO mensagem = service.excluirProduto(codigo);
        return new ResponseEntity<>(mensagem, HttpStatus.NO_CONTENT); 
    } catch (NoSuchElementException e) {
        return new ResponseEntity<>(new MensagemDTO(null,e.getMessage()), HttpStatus.NOT_FOUND);
    }
}
    
    
}

