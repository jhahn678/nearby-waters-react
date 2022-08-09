import React from 'react'
import classes from './EditPage.module.css'
import Page from '../../components/shared/Page'

const EditPage = (): JSX.Element => {
  return (
    <Page className={classes.container}>
      <div className={classes.controlSection}></div>
      <div className={classes.mapSection}></div>
    </Page>
  )
}

export default EditPage