import {setStore, getStore} from '@/util/store'
import {dateFormat} from '@/util/date'

import {sendLogs} from '@/api/user'
import {defineStore} from 'pinia'

export const useLogsStore = defineStore('dict', {
  state: () => {
    return {
      logsList: getStore({name: 'logsList'}) || []
    }
  },
  actions: {
    SendLogs () {
      return new Promise((resolve, reject) => {
        sendLogs(this.logsList)
          .then(() => {
            this.CLEAR_LOGS()
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    ADD_LOGS: ({type, message, stack, info}) => {
      this.logsList.push(
        Object.assign(
          {
            url: window.location.href,
            time: dateFormat(new Date())
          },
          {
            type,
            message,
            stack,
            info: info.toString()
          }
        )
      )
      // setStore({name: 'logsList', content: state.logsList})
      setStore({name: 'logsList', content: []})
    },
    CLEAR_LOGS: () => {
      this.logsList = []
      setStore({name: 'logsList', content: this.logsList})
    }
  }
})
