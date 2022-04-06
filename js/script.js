class Modal {
   constructor(options){
      let defaultOptions = {
         isOpen: () => {},
         isClose: () => {}
      }
      this.options = Object.assign(defaultOptions, options)
      this.modal = document.querySelector(".modal")
      this.speed = false
      this.animation = false
      this.isOpen = false
      this.modalContainer = false
      this.previousActiveElement = false
      this.fixBlocks = document.querySelectorAll(".fix-block")
      this.focusElements = [
         "a[href]",
         "input",
         "button",
         "select",
         "textarea",
         "[tabindex]",
      ]
      this.events()
   }

   events(){
      if(this.modal){
         document.addEventListener("click", function(e){
            const clickedElement = e.target.closest("[data-yar-path]")
            console.log(clickedElement);
            if(clickedElement){
               let target = clickedElement.dataset.yarPath
               let animation = clickedElement.dataset.yarAnimation
               let speed = clickedElement.dataset.yarSpeed
               this.animation ? animation : "fade"
               this.speed ? parseInt(speed) : 300
               this.modalContainer = document.querySelector(`[data-yar-target="${target}"]`)
               this.open()
               return
            }
            if(e.target.closest(".modal-close")){
            this.close()
            return
         }
         }.bind(this))

         window.addEventListener("keydown", function(e){
            if(e.keyCode == 27){
               if(this.isOpen){
                  this.close()
               }
            }
            if(e.keyCode == 9){
               this.focusCatch(e)
               return
            }
         }.bind(this))


         this.modal.addEventListener("click", function(e){
            if(!e.target.classList.contains("modal__container") && !e.target.closest(".molal__container") && this.isOpen){
               this.close()
            }
         }.bind(this))
      }
   }

   open(){
      this.previousActiveElement = document.activeElement
      this.modal.style.setProperty("--transition-time", `${this.speed / 1000}s`)
      this.modal.classList.add("is-open")
      this.disableScroll()

      this.modalContainer.classList.add("modal-open")
      this.modalContainer.classList.add(this.animation)

      setTimeout(()=>{
         this.modalContainer.classList.add("animation-open")
         this.options.isOpen(this)
         this.isOpen = true
         this.focusTrap()
      }, this.speed)
   }

   close(){
      if(this.modalContainer){
      this.modalContainer.classList.remove("animation-open")
      this.modalContainer.classList.remove(this.animation)
      this.modal.classList.remove("is-open")
      this.modalContainer.classList.remove("modal-open")

      this.enableScroll()
      this.options.isClose(this)
      this.isOpen = false
      this.focusTrap()
      }
   }

   focusCatch(e){
      const focusablu = this.modalContainer.querySelectorAll(this.focusElements)
      const focusArray = Array.prototype.slice.call(focusablu)
      const focusedIndex = focusArray.indexOf(document.activeElement)

      if(e.shiftKey && focusedIndex == 0){
         focusArray(focusArray.length -1).focus()
         e.preventDefault()
      }
      if(!e.shiftKey && focusedIndex === focusArray.length - 1){
         focusArray[0].focus()
         e.preventDefault()
      }
   }

   focusTrap(){
      const focusablu = this.modalContainer.querySelectorAll(this.focusElements)
      if(this.isOpen){
         if(focusablu){
            focusablu[0].focus()
         } else {
            this.previousActiveElement.focus()
         }
      }
   }

   disableScroll(){
      let pagePosition = window.scrollY
      this.lockPadding()
      document.body.classList.add("disable-scroll")
      document.body.dataset.position = pagePosition
      document.body.style.top = -pagePosition + "px"
      


   }

   enableScroll(){
      let pagePosition = parseInt(document.body.dataset.position, 10)
      this.unLockPadding()
      document.body.style.top = "auto"
      document.body.classList.remove("disable-scroll")
      window.scroll({top:pagePosition, left:0})
      document.body.removeAttribute("data-position")
   }

   lockPadding(){
      let paddingOffset = window.innerWidth - document.body.offsetWidth + "px"
      this.fixBlocks.forEach(el => {
         el.style.paddingRight = paddingOffset
      })
   }

   unLockPadding(){
      this.fixBlocks.forEach(el => {
         el.style.paddingRight = "0px"
      })
      document.body.style.paddingRight = "0px"
   }
}

const modal = new Modal({
   isOpen:()=>{
      console.log(modal);
      console.log("opened");
   },
   isClose:()=>{
      console.log("closed");
   }
})