- Reading the NodeJS tutorial, I was initialy extremely confused about the nature of the boot.js file. It's said that you have to pass its path to the CLI, but it doesn't say what it's content should be, nor where to put it (is it worker or client related?).

- The separation between client (starting workflows) and workers (executing workflows) should be clearer in the doc.

- Some examples show Zenaton workflows and tasks implementations with just a function as handler, others show the use of an object with init/id/handle methods. It's confusing. Why not just one interface?

- It's confusing that you use the same workflow definition files to register them on client and worker side. That means that in a NodeJS environment, you would have to make an NPM package to share those definition files between client and workers, which ruins a bit the Zenaton experience which is to simplify workflow management. Maybe there should be a way to generate a special file that describes your workflows, and that you would just have to drop in your app. Or just nothing at all: you just call the agent with a workflow name.

- It's confusing that you have to start the same Zenaton agent on both the worker and the app. Maybe there should be a worker agent and a client agent to make things clearer and put emphasis on the separation.

- It's strange that to start the CLI listen mecanism, you need the credentials in both the .env file and being passed to the `Client.init()`. It feels like you're doing the same thing twice.

- Implementing the PublishArticle workflow, I wasn't sure if the creation and insertion in the database of the article could stay in th app code, or was supposed to move in a Zenaton task.  
  Like between :

  - HTTP Call --> Start workflow with HTTP payload --> Task to save article --> Wait for approve event --> Task to approve article
  - HTTP Call --> Save article in database --> Start workflow with just article id --> Wait for approve event --> Task to approve article

  I ended up using the second option because it felt awkward to pass the whole payload if an unregistered article to the workflow init.

  - I had a bug where I wrote:  
    `if (event && event.approved) {}` where it should have been `if (event && event.data.approved) {}` (which is actually better, good practices say arbitrary data for an event goes in a `data` field)  
    I realized I just copy/pasted this line from the NodeJS documentation:  
    `if (event && event.rejected) {}`
