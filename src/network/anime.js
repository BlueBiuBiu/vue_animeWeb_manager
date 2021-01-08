import request from "./request"

export function getAnimeList(offset,limit){
  return request({
    url: "/anime",
    params: {
      offset,
      limit
    }
  })
}

export function getSearchList(name,offset,limit){
  return request({
    url: `/anime/${name}`,
    params: {
      offset,
      limit
    }
  })
}

export function updateAnimeById(id,name,author,type,place,language,year,img){
  return request({
    url: `/anime/${id}`,
    method: "POST",
    data: {
      id,
      name,
      author,
      type,
      place,
      language,
      year,
      img
    }
  })
}

export function uploadAnime(name,author,type,place,language,year,img,index,link){
  return request({
    url: `/anime/upload/animeInfo`,
    method: "POST",
    data: {
      name,
      author,
      type,
      place,
      language,
      year,
      img,
      index,
      link
    }
  })
}

export function deleteAnimeById(id){
  return request({
    url: `/anime/delete/${id}`,
    method: "POST"
  })
}