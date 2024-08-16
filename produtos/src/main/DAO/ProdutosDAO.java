import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.api.produtos.Model.Produto;

@Repository
public interface ProdutosDAO extends JpaRepository<Produto,Long> {
    
}
