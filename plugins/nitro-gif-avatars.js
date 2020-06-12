const privateChannels = document.getElementById('private-channels'),
      config = { childList: true },
      observer = new MutationObserver((mutationList, observer) => {
          reqGifAvatars()
      });

let unavailableGifs = [];

const reqGifAvatars = () => {
  document.querySelectorAll('a[class^="channel-"] div[class^="layout-"]').forEach(avatar => { 
    try {
      avatar.addEventListener('mouseenter', async (e) => {
        let imgPath = e.target.querySelector('div[class^="avatar-"] img')
        let newURI = imgPath.src.replace(/.png/gi, '.gif')

        if(unavailableGifs.includes(avatar.parentElement.href)) {       
          return
        }
        
        let response = await fetch(newURI)
        
        if(response.ok) {
          imgPath.src = newURI        
        } else {
          unavailableGifs.push(avatar.parentElement.href)
        }

      })

      avatar.addEventListener('mouseleave', async (e) => {
        let imgPath = e.target.querySelector('div[class^="avatar-"] img')
        let oldURI = imgPath.src.replace(/.gif/gi, '.png')
        imgPath.src = oldURI
      })
    } catch(err) {
      return
    }
  })
}

observer.observe(privateChannels, config);
reqGifAvatars();