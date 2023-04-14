import { Buffer } from 'buffer'; //or 'buffer/', with trailing slash
import * as Process from 'process';
globalThis.process = Process;
globalThis.Buffer = Buffer;
