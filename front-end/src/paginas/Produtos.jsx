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

  const [newProduto, setNewProduto] = useState({
   nome:'',
   descricao:'',
   preco:''
  });
  const [editProduto, setEditProduto] = useState({
    codigo: '',
    nome:'',
   descricao:'',
   preco:''
  });

  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [showAlert, setShowAlert] = useState(false);

  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/produto/listar")
      .then(response => response.json())
      .then(data => setProdutos(data))
      .catch(error => console.error('Error fetching produtos:', error));
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

  useEffect(() => {
    buscarProdutos();
  }, []);

  const buscarProdutos = () => {
    fetch("http://localhost:8080/produto/listar")
      .then(response => response.json())
      .then(data => setRecords(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  };

  function handleFilter(event) {
    const newData = records.filter(row => {
      return row.descricao.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase());
    });
    setRecords(newData);
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
        nome:'',
       descricao:'',
       preco:''
    });
    setAlertMessage('');
  }

  const handleCloseAlterar = () => {
    setShowAlterar(false);
    setNewProduto({
        nome:'',
       descricao:'',
       preco:''
    });
    setAlertMessage('');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduto(prevState => ({
      ...prevState,
      [name]: value
    }));
  }


  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditProduto(prevState => ({
      ...prevState,
      [name]: value
    }));
  };



  const salvar = () => {
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
          setShowCadastrar(false); // Fechar modal após o cadastro
        } else {
          setAlertVariant('danger');
          setAlertMessage('Erro ao cadastrar produto. Por favor, tente novamente.');
          setShowCadastrar(false); // Fechar modal após o erro
          console.error('Erro ao salvar o produto. Status:', response.status);
        }
      })
      .catch(error => {
        setAlertVariant('danger');
        setAlertMessage('Erro ao cadastrar produto. Por favor, tente novamente.');
        console.error('Erro ao salvar o produto:', error);
        setShowCadastrar(false); // Fechar modal após o erro
      });
  }

  const alterar = () => {
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
          setShowAlterar(false); // Fechar modal após o cadastro
        } else {
          setAlertVariant('danger');
          setAlertMessage('Erro ao alterar produto. Por favor, tente novamente.');
          setShowAlterar(false); // Fechar modal após o erro
          console.error('Erro ao alterar o produto. Status:', response.status);
        }
      })
      .catch(error => {
        setAlertVariant('danger');
        setAlertMessage('Erro ao alterar produto. Por favor, tente novamente.');
        console.error('Erro ao alterar o produto:', error);
        setShowAlterar(false); // Fechar modal após o erro
      });
  }



  const excluir = (id) => {

    console.log("Excluindo", id);

    fetch(`http://localhost:8080/produto/excluir?id=${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          setAlertVariant('success');
          setAlertMessage('Produto excluído com sucesso!');
          setShowAlert(true);
          buscarProdutos(); // Atualizar a lista após a exclusão
        } else {
          setAlertVariant('danger');
          setAlertMessage('Erro ao excluir produto. Por favor, tente novamente.');
          setShowAlert(true);
        }
      })
      .catch(error => {
        console.error('Erro ao excluir produto:', error);
        setAlertVariant('danger');
        setAlertMessage('Erro ao excluir produto. Por favor, tente novamente.');
        setShowAlert(true);
      })
      .finally(() => {
        setShowCadastrar(false);
      });
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
      selector: row => row.cpdigo,
      sortable: true
    },
    {
      name: 'Nome do produto',
      selector: row => row.nome,
      sortable: true
    },
    {
      name: 'Descrição',
      selector: row => row.descricao,
      sortable: true
    },
    {
      name: 'Preço',
      selector: row => row.preco,
      sortable: true
    },
    {
      name: 'Ações',
      cell: row => (
        <div>
          <Button variant="primary" size="sm" onClick={() => handleEdit(row)}>Editar</Button>{' '}
          <Button variant="danger" size="sm" onClick={() => excluir(row.id)}>Excluir</Button>
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
      <h1 style={{ textAlign: 'center' }} >Produtos</h1>
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
                value={newProduto.nome}
                onChange={handleChange}
                autoFocus
              />
            </Form.Group>
            <Form.Group controlId="formDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                name="descricao"
                value={newProduto.descricao}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPreco">
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="number"
                name="preco"
                step="0.01"
                min="0.01" 
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
                value={editProduto.descricao}
                onChange={handleChangeEdit}
              />
            </Form.Group>
            <Form.Group controlId="formPreco">
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="number"
                name="preco"
                step="0.01"
                min="0.01"
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