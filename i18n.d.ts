import en from './messages/en.json';
import es from './messages/es.json';

type Messages = typeof en | typeof es;

declare global {
  interface IntlMessages extends Messages { }
}