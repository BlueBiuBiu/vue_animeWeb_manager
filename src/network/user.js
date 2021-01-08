import request from "./request"

export function getUserList(offset,limit){
  return request({
    url: "/user",
    params: {
      offset,
      limit
    }
  })
}

export function getUserAvatar(){
  return request({
    url: `/user/avatar/Url`
  })
}

export function getSearchList(name,offset,limit){
  return request({
    url: `/user/${name}`,
    params: {
      offset,
      limit
    }
  })
}

export function updateAnimeById(id,password){
  return request({
    url: `/user/update/${id}`,
    method: "POST",
    data: {
      password
    }
  })
}

export function deleteUserById(id){
  return request({
    url: `/user/delete/${id}`,
    method: "POST"
  })
}

export function deleteUserCollectById(id,collect){
  return request({
    url: `/user/delete/collect/${id}`,
    method: "POST",
    data: {
      collect
    }
  })
}