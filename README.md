# Scraft

React library for JSON configured apps.

## Features
- Available as both a function and React Hook
- Supports standard React components
- Dynamic JSON configuration supports string interpolation & function composition
- Handles page routing & layouts
- Logs errors detected in the configuration

## Installing
Using npm:

```bash
$ npm install --save scraft
```

Using yarn:

```bash
$ yarn add scraft
```

## Usage

`App.js`
```js 
import React from 'react';
import { useBuilder } from 'scraft';
import { AppBar, Tabs, ColorBlock } from './components';

const config = readFile('./config.json');
const components = { AppBar, Tabs, ColorBlock };
const utils = { log: message => console.log(message) };

const App = props => {
	const BuiltApp = useBuilder(config, components, utils);
	return <BuiltApp />;
};
```

or

```js 
import React from 'react';
import { build } from 'scraft';
import { AppBar, Tabs, ColorBlock } from './components';

const config = readFile('./config.json');
const components = { AppBar, Tabs, ColorBlock };
const utils = { log: message => console.log(message) };

const App = build(config, components, utils);
```

`config.json`
```json
{
    "app": {
        "containerIds": ["appBar"],
        "routes": [
            {
                "path": "/",
                "exact": true,
                "pageId": "rootPage"
            }
        ]
    },
    "pages": [
        {
            "id": "rootPage",
            "containerIds": ["pageTabs"],
            "widgetIds": ["redBlock"],
            "layouts": {
                "lg": [
                    {
                        "i": "redBlock",
                        "x": 0,
                        "y": 0,
                        "w": 12,
                        "h": 4
                    }
                ]
            }
        }
    ],
    "containers": [
        {
            "id": "appBar",
            "component": {
                "type": "AppBar"
            }
        },
        {
            "id": "pageTabs",
            "component": {
                "type": "Tabs"
            }
        }
    ],
    "widgets": [
        {
            "id": "redBlock",
            "handlers": {
                "notifyClick": {
                    "function": "${utils.log}",
                    "parameters": ["Red block clicked!"]
                }
            },
            "component": {
                "type": "ColorBlock",
                "props": {
                    "background": "red",
                    "onClick": "${handlers.notifyClick}"
                }
            }
        }
    ]
}
```

## Configuration API

### App
Configures the initial application level state, and containers. These will persist throughout the entire lifetime of the application. Routing within the application is also configured here.

##### Schema
```js
object().shape({
  initState: object(),
  containerIds: array().of(string()),
  routes: array().of(
    object().shape({
      path: string().required(),
      pageId: string().required()
    })
  )
})
```

### Pages
Configures initial page level state, containers, and widgets. These will persist for as long as the page is mounted. Configuration for widget layout & grid is also available. The widget grid has 12 columns, and the following breakpoints:

- lg: >= 1200px
- md: >= 992px 
- sm: >= 768px
- xs: < 768px

##### Schema
```js
object().shape({
  id: string().required(),
  initState: object(),
  initLayoutMode: boolean(),
  containerIds: array().of(string()),
  widgetIds: array().of(string()),
  layouts: object().shape({
      lg: array().of(layoutSchema),
      md: array().of(layoutSchema),
      sm: array().of(layoutSchema),
      xs: array().of(layoutSchema)
  }),
  grid: object().shape({
      margin: array()
          .of(number())
          .max(2),
      padding: array()
          .of(number())
          .max(2),
      cols: object().shape({
          lg: number(),
          md: number(),
          sm: number(),
          xs: number()
      }),
      rowHeight: number()
  })
})
```

#### Layout Schema
```js
object().shape({
  i: string().required(),
  x: number().required(),
  y: number().required(),
  w: number().required(),
  h: number().required(),
  minW: number(),
  minH: number(),
  maxW: number(),
  maxH: number()
})
```

### Containers & Widgets
Containers and widgets share the same wrapper component which allows for the interpolation of their props.
Each of these also allows for the composition of functions via the `handlers` property. Container components all receive the widgets as children so it's important to pass them down the tree like the following:

```js
const Container = props => {
  return <div>{props.children}</div>;
};
```

##### Schema

```js
object().shape({
  id: string().required(),
  initState: object(),
  handlers: object(),
  onMount: string(),
  onUnmount: string(),
  component: object()
      .shape({
          type: string().required(),
          props: object()
      })
      .required()
})
```
