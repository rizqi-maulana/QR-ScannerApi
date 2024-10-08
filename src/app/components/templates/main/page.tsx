"use client"
import { Fragment, useContext } from 'react'
import { AppContext } from '@/app/hook/Context'
import Login from '@/app/login/page'
import Users from '@/app/users/page'
import Domain from '@/app/domain/page'
export default function ValidatePage() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('AppContext is not available')
  }
  return (
    <Fragment>
      {
        context.SavedDomain ?
          (context.Access ? <Users /> : <Login />)
          :
          <Domain />
      }
    </Fragment>
  )
}
