import { Observable } from "rxjs";

export interface DataProvider<Meta, ResultData> {

  load(meta: Meta): Observable<ResultData[]>;

}