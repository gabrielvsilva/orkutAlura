import React, { useEffect, useState } from 'react';
import MainGrid from '../components/MainGrid';
import Box from '../components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../components/ProfileRelations';
import BoxWrapper from '../components/BoxWrapper';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

function ProfileSidebar(props){
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }}/>
      <hr />
      <p className="boxLink">
        <a className="" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props){
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
          {props.title} ({props.items?.length})
      </h2>
      <ul>
        {props.items.slice(0, 6).map((item, index) => {
          return (
              <li key={index}>
                  <a>
                      <img src={item?.html_url+".png"} style={{ borderRadius: '8px' }}/>
                      <span>{item.login}</span>
                  </a>
              </li>
          )
          })
        }
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {

  const usuarioAleatorio = props.githubUser;
  const [seguidores, setSeguidores] = useState([]);

  const pessoasFavoritas = [
    {id: 1, name: 'juunegreiros', image: 'https://github.com/juunegreiros.png'},
    {id: 2, name: 'omariosouto', image: 'https://github.com/omariosouto.png'},
    {id: 3, name: 'peas', image: 'https://github.com/peas.png'},
    {id: 4, name: 'rafaballerini', image: 'https://github.com/rafaballerini.png'},
    {id: 5, name: 'marcobrunodev', image: 'https://github.com/marcobrunodev.png'},
    {id: 6, name: 'felipefialho', image: 'https://github.com/felipefialho.png'}
  ];

  /* const [comunidades, setComunidades] = React.useState([{
    id: '12802378123789378912789789123896123', 
    name: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]); */
  const [comunidades, setComunidades] = React.useState([]);


  useEffect(function(){
    fetch('https://api.github.com/users/peas/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function(respostaDoServidor){
        setSeguidores(respostaDoServidor)
    })

    console.log("process ", process);
    //API GRAPH
    fetch('https://graphql.datocms.com/', {
      method: 'POST', 
      headers: {
        'Authorization': '07b3c0ca056fe3269b196458de55b7',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({"query": `query {
        allCommunities {
          id
          title
          image
          creatorSlug
        }
      }` })
    })
    .then(response => response.json()) 
    .then((responseCompleta) => {
      console.log("reresponseCompleta ", responseCompleta);
      setComunidades(responseCompleta.data.allCommunities)
    })
  },[]);

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio}/>
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box className="title">
            <h1>Bem vindo (a)</h1>  

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            
            <form onSubmit={function handleSubmit(event){
              event.preventDefault();

              const dadosForm = new FormData(event.target);
              
              const comunidade = {
                title: dadosForm.get('title'),
                image: dadosForm.get('image'),
                creatorSlug: usuarioAleatorio
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const data = await response.json();
                const comunidadeAtualizada = [...comunidades, data.registroCriado];
                setComunidades(comunidadeAtualizada)
              })
            }}>
              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?" 
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>

              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores}/>
          <BoxWrapper title="Meus amigos" item={pessoasFavoritas}/>
          <BoxWrapper title="Minhas comunidades" item={comunidades}/>
        </div>
      </MainGrid>
    </>
  )
}


export async function getServerSideProps(context){

  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const { githubUser } = jwt.decode(token);

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      'Authorization': token,
    },
  })
  .then((response) => response.json())

  console.log("isAutenticated ", isAuthenticated);

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: {
      githubUser
    }
  }
}