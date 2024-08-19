import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';

const Produtos = () => {
  const [records, setRecords] = useState([]);
  const [showCadastrar, setShowCadastrar] = useState(false);
  const [showAlterar, setShowAlterar] = useState(false);
  const [showExcluir, setShowExcluir] = useState(false);
  const [produtoExcluir, setProdutoExcluir] = useState(null);
  const [newProduto, setNewProduto] = useState({
    nome: '',
    descricao: '',
    preco: ''
  });
  const [editProduto, setEditProduto] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    preco: ''
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    buscarProdutos();
  }, []);

  useEffect(() => {
    if (alertMessage) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setAlertMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const buscarProdutos = () => {
    fetch("http://localhost:8080/produto/listar")
      .then(response => response.json())
      .then(data => setRecords(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  };

  function handleFilter(event) {
    const query = event.target.value.toLowerCase();
    if (query === '') {
      buscarProdutos(); // Recarregar todos os produtos se o campo de pesquisa estiver vazio
    } else {
      const newData = records.filter(row =>
        row.descricao.toLowerCase().includes(query)
      );
      setRecords(newData);
    }
  }

  const handleNovoProduto = () => {
    setShowCadastrar(true);
  }

  const handleEdit = (row) => {
    setEditProduto(row);
    setShowAlterar(true);
  }

  const handleClose = () => {
    setShowCadastrar(false);
    setNewProduto({
      nome: '',
      descricao: '',
      preco: ''
    });
    setAlertMessage('');
  }

  const handleCloseAlterar = () => {
    setShowAlterar(false);
    setEditProduto({
      codigo: '',
      nome: '',
      descricao: '',
      preco: ''
    });
    setAlertMessage('');
  }

  const handleCloseDelete = () => {
    setShowExcluir(false);
    setProdutoExcluir(null);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'preco') {
      if (parseFloat(value) > 99999999.99) {
        return;
      }
    }
    setNewProduto(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    if (name === 'preco') {
      if (parseFloat(value) > 99999999.99) {
        return;
      }
    }
    setEditProduto(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const salvar = () => {

    if (!newProduto.nome || !newProduto.descricao || !newProduto.preco) {
      setShowCadastrar(false);
      setAlertVariant('danger');
      setAlertMessage('Todos os campos são obrigatórios.');
      setShowAlert(true);
      return;
    }
  

    fetch('http://localhost:8080/produto/salvar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduto)
    })
      .then(response => {
        if (response.ok) {
          setAlertVariant('success');
          setAlertMessage('Produto cadastrado com sucesso!');
          buscarProdutos();
          setShowCadastrar(false);
        } else {
          setAlertVariant('danger');
          setAlertMessage('Erro ao cadastrar produto. Por favor, tente novamente.');
        }
      })
      .catch(error => {
        setAlertVariant('danger');
        setAlertMessage('Erro ao cadastrar produto. Por favor, tente novamente.');
        console.error('Erro ao salvar o produto:', error);
      })
      .finally(() => {
        setShowCadastrar(false);
      });
  }

  const alterar = () => {
    if (!editProduto.nome || !editProduto.descricao || !editProduto.preco) {
      setShowAlterar(false);
      setAlertVariant('danger');
      setAlertMessage('Todos os campos são obrigatórios.');
      setShowAlert(true);
      return;
    }
  
    fetch('http://localhost:8080/produto/salvar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editProduto)
    })
      .then(response => {
        if (response.ok) {
          setAlertVariant('success');
          setAlertMessage('Produto alterado com sucesso!');
          buscarProdutos();
          setShowAlterar(false);
        } else {
          setAlertVariant('danger');
          setAlertMessage('Erro ao alterar produto. Por favor, tente novamente.');
        }
      })
      .catch(error => {
        setAlertVariant('danger');
        setAlertMessage('Erro ao alterar produto. Por favor, tente novamente.');
        console.error('Erro ao alterar o produto:', error);
      })
      .finally(() => {
        setShowAlterar(false);
      });
  }

  const excluir = () => {
    fetch(`http://localhost:8080/produto/excluir?codigo=${produtoExcluir}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          setAlertVariant('success');
          setAlertMessage('Produto excluído com sucesso!');
          buscarProdutos(); // Atualizar a lista após a exclusão
        } else {
          setAlertVariant('danger');
          setAlertMessage('Erro ao excluir produto. Por favor, tente novamente.');
        }
      })
      .catch(error => {
        setAlertVariant('danger');
        setAlertMessage('Erro ao excluir produto. Por favor, tente novamente.');
        console.error('Erro ao excluir produto:', error);
      })
      .finally(() => {
        setShowExcluir(false); 
        setProdutoExcluir(null);
      });
  }

  const handleShowExcluir = (codigo) => {
    setProdutoExcluir(codigo);
    setShowExcluir(true);
  }

  const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  const columns = [
    {
      name: 'Código',
      selector: row => row.codigo,
      sortable: true
    },
    {
      name: 'Nome do Produto',
      selector: row => row.nome,
      sortable: true
    },
    {
      name: 'Descrição do Produto',
      selector: row => row.descricao,
      sortable: true
    },
    {
      name: 'Preço do Produto',
      selector: row =>'R$ '+ parseFloat(row.preco).toFixed(2),
      sortable: true
    },
    {
      name: 'Ações',
      cell: row => (
        <div>
          <Button variant="primary" size="sm" onClick={() => handleEdit(row)}>Editar</Button>{' '}
          <Button variant="danger" size="sm" onClick={() => handleShowExcluir(row.codigo)}>Excluir</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      {alertMessage && (
        <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
          {alertMessage}
        </Alert>
      )}
      <h1 style={{ textAlign: 'center' }}>Produtos</h1>
      <Button variant="primary" onClick={handleNovoProduto}>
        Cadastrar Produto
      </Button>
      <Modal show={showCadastrar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Preencha os dados</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNome">
              <Form.Label>Nome do Produto</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                maxLength={100}
                value={newProduto.nome}
                onChange={handleChange}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group controlId="formDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                name="descricao"
                required
                maxLength={255}
                value={newProduto.descricao}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPreco">
              <Form.Label>Preço</Form.Label>
              <Form.Control
              
                type="number"
                name="preco"
                min="0.01" 
                step="0.01" 
                required
                max="99999999.99"
                value={newProduto.preco}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={salvar}>
            Cadastrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAlterar} onHide={handleCloseAlterar}>
        <Modal.Header closeButton>
          <Modal.Title>Alterar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="id">
              <Form.Label>Código do Produto </Form.Label>
              <Form.Control
                type="number"
                name="codigo"
                value={editProduto.codigo}
                onChange={handleChangeEdit}
                disabled
                autoFocus
              />
            </Form.Group>
            <Form.Group controlId="formNome">
              <Form.Label>Nome do Produto</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                maxLength={100}
                value={editProduto.nome}
                onChange={handleChangeEdit}
                autoFocus
              />
            </Form.Group>
            <Form.Group controlId="formDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                name="descricao"
                maxLength={255}
                value={editProduto.descricao}
                onChange={handleChangeEdit}
              />
            </Form.Group>
            <Form.Group controlId="formPreco">
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="number"
                name="preco"
                min="0.01" 
                step="0.01" 
                required
                max="99999999.99"
                value={editProduto.preco}
                onChange={handleChangeEdit}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAlterar}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={alterar}>
            Alterar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showExcluir} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza de que deseja excluir o produto de código: {produtoExcluir} ? </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={excluir}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      <input type="text" style={{ marginLeft: '75%' }} placeholder="Pesquisar..." onChange={handleFilter} />
      <div className="mt-1">
        {records.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h6 className="">Não há dados disponíveis.</h6>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={records}
            selectableRows
            fixedHeader
            pagination
            paginationComponentOptions={paginationComponentOptions}
          />
        )}
      </div>
    </div>
  );
};

export default Produtos;
