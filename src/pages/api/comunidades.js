import { SiteClient } from "datocms-client";

export default async function recebedorDeRequest(request, response){

    if(request.method === 'POST'){
        const token = '07b3c0ca056fe3269b196458de55b7';
        const client = new SiteClient(token);
    
        const registroCriado = await client.items.create({
            itemType: "972341",
            ...request.body
            /* title: "Eu amo tartaruga",
            image: "https://cdn.diferenca.com/imagens/tartaruga-cagado-e-jabuti-og.jpg",
            creatorSlug: "gabriel" */
        })

        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado
        })

        return;
    }

    

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem.'
    })
}