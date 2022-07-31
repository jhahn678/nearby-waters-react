import React from 'react'
import classes from './index.module.css'
import Page from '../../components/shared/Page'
import { Code, List, Text, Title, Button } from '@mantine/core'

const APIPage = () => {
  return (
    <Page className={classes.container}>
      <section className={classes.leftNavigation}>
        <List listStyleType='none' >
          <List.Item><Text className={classes.listItem}>Overview</Text></List.Item>
          <List.Item>
            <Text className={classes.listItem}>Endpoints</Text>
            <List withPadding listStyleType='none'>
              <List.Item>
                <Text className={classes.listItem}>/near</Text>
              </List.Item>
              <List.Item>
                <Text className={classes.listItem}>/geojson </Text>
              </List.Item>
              <List.Item>
                <Text className={classes.listItem}>/search</Text>
              </List.Item>
            </List>
          </List.Item>
        </List>
      </section>
      <main className={classes.main}>

      </main>
    </Page>
  )
}

export default APIPage;