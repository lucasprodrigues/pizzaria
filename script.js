let modalQt=1
let modalKey=0
let car=[]
const Q = ((el)=>{
    return document.querySelector(el)//substituindo o document.querySelector
    });
const Qs= ((el)=>document.querySelectorAll(el));

//listando as pizzas
pizzaJson.map((item, position)=>{
    let pizzaItem= Q(`.models .pizza-item`).cloneNode(true) //para pegar as informarções do atributos

    pizzaItem.setAttribute(`data-key`, position)//Para identificar cada pizza
    
    pizzaItem.querySelector(`.pizza-item--img img`).src=item.img; //para substituição de image no src(obs:apenas classes precisam de . no querySelector... quando buscamos um atributo podemos colocar apenas o nome do atributo

    pizzaItem.querySelector(`.pizza-item--name`).innerHTML=item.name;
    
    pizzaItem.querySelector(`.pizza-item--desc`).innerHTML=item.description;
    
    pizzaItem.querySelector(`.pizza-item--price`).innerHTML=`R$ ${item.price.toFixed(2)}`; //o toFixed pra acrecentar dois algarismos depois da virgula... quando for pra dinheiro.

   
   //listando as pizzas no windowArea (modal)
   
    pizzaItem.querySelector(`a`).addEventListener(`click`,(e)=>{
        e.preventDefault();

        /*4 passo pegar a pizza clicada */
        let key =e.target.closest(`.pizza-item`).getAttribute(`data-key`);
        console.log(`pizza clicada:` + key);
        modalQt=1;
        modalKey=key;


        Q(`.pizzaInfo h1`).innerHTML=pizzaJson[key].name; // para pegar o nome.

        Q(`.pizzaInfo--desc`).innerHTML=pizzaJson[key].description; // para pegar o nome.

        Q(`.pizzaBig img`).src=pizzaJson[key].img;//colocando imagem

        Q(`.pizzaInfo--size.selected`).classList.remove(`selected`);//precisamos primeiro remover a seleção 

        Qs(`.pizzaInfo--size`).forEach((size,indexSize)=>{

            if (indexSize==2){
                size.classList.add(`selected`);
            };


            size.querySelector(`span`).innerHTML=pizzaJson[key].sizes[indexSize] //utilizando o querySelectorAll() o forEach: "para cada um dos itens"
                })

        Q(`.pizzaInfo--qt`).innerHTML=modalQt;

        Q(`.pizzaInfo--actualPrice`).innerHTML=`R$${pizzaJson[key].price.toFixed(2)}`;  
                 
       /*3 passo para uma animação de  redução de velocidade bem definida */
       Q(`.pizzaWindowArea`).style.opacity=0// mudar css para opacidade 0
        /* console.log(`Clicou na pizza`)*///bloqueio da ação padrão do HTML.. adicionando elemento pelo javaScript
       Q(`.pizzaWindowArea`).style.display=`flex`; //auteração no css para aparece na tela após o click

       setTimeout(()=>{
           Q(`.pizzaWindowArea`).style.opacity=1; //necessário usar arrowfunction para permanecer no 0 pra depois passar para o 1 


       },200)// 200 milissigundos para consiguirmos usar a animação da opacidade 0 para 1 em velecidade reduzida
       
       

    });

Q(`.pizza-area`).append(pizzaItem);
    
     
    



 });

 //eventos do modal
 /* 1° acão de cancelar*/
function closeModal(){//podemos fechar   o modal
    Q(`.pizzaWindowArea`).style.opacity=0; //auteração no css para ficar transparente na tela após o click

     setTimeout(()=>{
        Q(`.pizzaWindowArea`).style.display=`none`; //necessário usar arrowfunction para permanecer no 0 pra depois passar para display none


      },200)
    
};
 Qs(`.pizzaInfo--cancelButton,.pizzaInfo--cancelMobileButton`).forEach((item)=>{
     item.addEventListener(`click`,closeModal);//leitura para cada item o mesmo vai  executar na ordem o click seguido da função close.
 });

Q(`.pizzaInfo--qtmenos`).addEventListener(`click`,()=>{
    if(modalQt > 1){
        modalQt--
        Q(`.pizzaInfo--qt`).innerHTML=modalQt
    }

})
Q(`.pizzaInfo--qtmais`).addEventListener(`click`, ()=>{
    modalQt++;
Q(`.pizzaInfo--qt`).innerHTML=modalQt

 });

Qs(`.pizzaInfo--size`).forEach((size)=>{ //nessa situação de remover  ou adicionar item apenas o um parametro resolve

  
  size.addEventListener(`click`,()=>{
    Q(`.pizzaInfo--size.selected`).classList.remove(`selected`);//primeiro removo a selecção original
      size.classList.add(`selected`)//depois adciona minha nova seleção
    })
  })


Q(`.pizzaInfo--addButton`).addEventListener(`click`,()=>{
    
    
let size = parseInt(Q(`.pizzaInfo--size.selected`).getAttribute(`data-key`))//seleção do tamanho ta pizza
let identifier=pizzaJson[modalKey].id+`@`+size;//criação de identificador para  evitar repetiçoes de pedido
let key= car.findIndex((item)=>item.identifier==identifier)//percorrer o key para achar o identificardor
    
if(key>-1){
    car[key].qt+=modalQt //se achar um identificar afetuar a soma como que já tem
}else{ //se não achar fazer o push com o que temos
        car.push({//array com informações da pizza do carrinho
        identifier,//indentificador
        id: pizzaJson[modalKey].id, //qual pizza
        size,//tamanho
        qt:modalQt//quantidade
         })

}


 uppDateCart();
 closeModal();

 
});

Q(`.menu-openner `).addEventListener(`click`,()=>{
  if(car.length>0){
      Q(`aside`).style.left=`0` 
  }
  
   

 })

 Q(`.menu-closer`).addEventListener(`click`,()=>{
    Q(`aside`).style.left=`100vw`
 })
function uppDateCart() {
      Q(`.menu-openner span`).innerHTML=car.length
    if(car.length>0){
        Q(`aside`).classList.add(`show`)
        Q(`.cart`).innerHTML=``;

        let subTotal=0
        let total=0
        let desconto=0
        for ( let i in car){
            let pizzaItem = pizzaJson.find((item)=>item.id==car[i].id )
            subTotal+= pizzaItem.price * car[i].qt;  //acessando pizzaJason para as informoções
           
            let cartItem = Q(`.models .cart--item`).cloneNode(true);//clanando dados do HTML
            let pizzaSize=``

              switch(car[i].size){
                 case 0:
                    pizzaSize=`(P)`
                 break;
                 case 1:
                    pizzaSize=`(M)`

                 break;
                 case 2:
                    pizzaSize=`(G)`

                 break;
               
                };


            //Adicionando Dados Clonados na div de Origem
            cartItem.querySelector(`img`).src=pizzaItem.img; //para substituição de image no src(obs:apenas classes precisam de . no querySelector... quando buscamos um atributo podemos colocar apenas o nome do atribut
            let pizzaName = `${pizzaItem.name} ${pizzaSize}`
            Q(`.cart`).append(cartItem)
            cartItem.querySelector(`.cart--item-nome`).innerHTML=pizzaName;
            cartItem.querySelector(`.cart--item--qt`).innerHTML=car[i].qt;
            cartItem.querySelector(`.cart--item-qtmais`).addEventListener(`click`,()=>{
                car[i].qt++;

                uppDateCart()
            })
              
         

            cartItem.querySelector(`.cart--item-qtmenos`).addEventListener(`click`,()=>{
                if (car[i].qt>1){
                   
                   car[i].qt--;
                   
                }else{
                    car.splice(i,1);
                }
                  uppDateCart()
                       
            });   
            
        };    
        desconto=subTotal*0.1
        total=subTotal - desconto 
        Q(`.subtotal span:last-child`).innerHTML=`R$${subTotal.toFixed(2)}`
        Q(`.desconto span:last-child`).innerHTML=`R$${desconto.toFixed(2)}`
        Q(`.total span:last-child`).innerHTML=`R$${total.toFixed(2)}`

        
        
      
            
       
      

    
      
    }else{
    Q(`aside`).classList.remove(`show`)
    Q(`aside`).style.left=`100vw`
   
     }


  
    

}
          
            
           
           

