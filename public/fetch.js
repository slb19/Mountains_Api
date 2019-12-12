
    const form=document.getElementById("f");
    form.addEventListener("submit",(e)=>{
      e.preventDefault()
      
      const body={name:"",
                  email:""}

     body.name=e.target[0].value;
     body.email=e.target[1].value;
   
     fetch("http://localhost:8080/register",{
       method:"POST",
       body:JSON.stringify(body),
       headers:{
         Accept:"Application/json",
         "Content-Type":"Application/json"
       }
    }).then(res=>{
      return res.json();
    }).then(data=>{
      //console.log(data)
      if(data.error){
        document.getElementById("submit-ok").textContent=data.error
        document.getElementById("s-modal").style.visibility="visible";

        setTimeout(()=>{
          document.getElementById("s-modal").style.visibility="hidden";
        },5000)
      
      }else{
        e.target[0].value="";
        e.target[1].value="";

          document.getElementById("submit-ok").textContent=`Thank you ${data.name} for registering to our service. We have send your api-key at the ${data.email}`
          document.getElementById("s-modal").style.visibility="visible";
          const close=document.getElementById("close1")
          close.addEventListener("click",()=>{
          document.getElementById("s-modal").style.visibility="hidden";
        });
      }
    });
  }); 