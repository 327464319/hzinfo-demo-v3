import Layout from '@/page/index/'
import * as rowRoutes from './config'
import {deepClone} from '@/util/util'

let routes = deepClone(rowRoutes.default)

const modules = import.meta.glob('../../**/**/*.vue')

if (routes) {
    function changeChildren (item) {
       item.component = Layout
        if (item.children && item.children.length > 0) {
           item.redirect = item.children && item.children.length > 0 ? `${item.children[0].path}` : `@/views/${item.path}/index`
            item.children.forEach((child) => {
                if (child.children && child.children.length > 0) changeChildren(child)
                else {
                    const paths = child.path.split('/')
                    // let subPath = ''
                    let lastPath = ''

                    paths.forEach((path, i) => {
                        // if (i > 1 && i < paths.length - 1) subPath += `/${path}`
                        if (i == paths.length - 1) lastPath = path
                    })

                    const meta = { i18n: lastPath }
                // @vite-ignore
                //     const component = () => import(`@/views${child.path}`)
                  const component = modules[`../../views${child.path}.vue`]
                   child.meta = meta
                   child.component = component
                }
            })
        } else {
            const subRoutes = []
            const subRoute = {
                path: 'index',
                name: item.name,
                meta: {
                    i18n: 'index'
                },
              // @vite-ignore
              //   component: () => import( `@/views${item.path}/index`)
               component :modules[`../../views${item.path}/index.vue`]
            }
            subRoutes.push(subRoute)

            item.redirect = `${item.path}/index`
            item.children = subRoutes
        }
    }

    routes.forEach((item) => changeChildren(item)
    )
} else {
    routes =  []
}

export default routes
