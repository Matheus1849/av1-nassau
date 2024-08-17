//declaração de variavel
let modalKey = 0
let itensQuantidade = 1
let cart = [] 

//funções para reduzir o codigo
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

//abrir item
const abrirModal = () => {
    seleciona('.comidaWindowArea').style.opacity = 0 // transparente
    seleciona('.comidaWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.comidaWindowArea').style.opacity = 1, 150)
}

//fechar item
const fecharModal = () => {
    seleciona('.comidaWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.comidaWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.comidaInfo--cancelButton, .comidaInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

//preencher os dados
const preencheritens = (itemMenu, item, index) => {
	itemMenu.setAttribute('data-key', index)
    itemMenu.querySelector('.comidas-item--img img').src = item.img
    itemMenu.querySelector('.comidas-item--price').innerHTML = item.price
    itemMenu.querySelector('.comidas-item--name').innerHTML = item.name
    itemMenu.querySelector('.comidas-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.comidaImagemGrande img').src = item.img
    seleciona('.comidaInfo h1').innerHTML = item.name
    seleciona('.comidaInfo--desc').innerHTML = item.description
    seleciona('.comidaInfo--actualPrice').innerHTML = item.price
}

// identificar o item no menu   
const pegarKey = (e) => {
    let key = e.target.closest('.comidas-item').getAttribute('data-key')
    itensQuantidade = 1
    modalKey = key
    return key
}

// alterar quantidade
const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.comidaInfo--qtmais').addEventListener('click', () => {
        itensQuantidade++
        seleciona('.comidaInfo--qt').innerHTML = itensQuantidade
    })

    seleciona('.comidaInfo--qtmenos').addEventListener('click', () => {
        if(itensQuantidade > 1) {
            itensQuantidade--
            seleciona('.comidaInfo--qt').innerHTML = itensQuantidade	
        }
    })
}

//colocar no carrinho de comprar
const adicionarNoCarrinho = () => {
    seleciona('.comidaInfo--addButton').addEventListener('click', () => {
        let price = seleciona('.comidaInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
	    let identificador = comidasJson[modalKey].id
        let key = cart.findIndex( (item) => item.identificador == identificador )

        if(key > -1) {

            cart[key].qt += itensQuantidade
        } else {

            let ComidaDados = {
                identificador,
                id: comidasJson[modalKey].id,
                qt: itensQuantidade,
                price: parseFloat(price) 
            }
            cart.push(ComidaDados)
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

//abrir o carrinho
const abrirCarrinho = () => {
    if(cart.length > 0) {

	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' 
    }

    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

//fechar o carrinho no mobile
const fecharCarrinho = () => {
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' 
        seleciona('header').style.display = 'flex'
    })
}

//atualizar o carrinho de compras
const atualizarCarrinho = () => {

	seleciona('.menu-openner span').innerHTML = cart.length
	
	if(cart.length > 0) {
		seleciona('aside').classList.add('show')
		seleciona('.cart').innerHTML = ''

		let total    = 0
		for(let i in cart) {
			
			let itemMenu = comidasJson.find( (item) => item.id == cart[i].id )
        	total += cart[i].price * cart[i].qt

			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let comidaNome = `${itemMenu.name} `


			cartItem.querySelector('img').src = itemMenu.img
			cartItem.querySelector('.cart--item-nome').innerHTML = comidaNome
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt


			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				cart[i].qt++
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				if(cart[i].qt > 1) {
					cart[i].qt--
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} 

		seleciona('.total span:last-child').innerHTML  = total
	} else {
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

//notificação formulario enviado
const finalizarCompra = () => {
    const formulario = seleciona('form'); 
  
    formulario.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Formulário enviado com sucesso!');
      window.location.reload();
    });
}

//alterar a quantidade
comidasJson.map((item, index ) => {

    let itemMenu = document.querySelector('.models .comidas-item').cloneNode(true)
    seleciona('.comida-area').append(itemMenu)
    preencheritens(itemMenu, item, index)
    
    itemMenu.querySelector('.comidas-item a').addEventListener('click', (e) => {
        e.preventDefault()

        let chave = pegarKey(e)

        abrirModal()

        preencheDadosModal(item)

		seleciona('.comidaInfo--qt').innerHTML = itensQuantidade

    })

    botoesFechar()

}) 

//chamando funções
mudarQuantidade()
adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()

