import { PersistStorage } from "./persistence";
import { inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { flattenObject } from "./helpers";

export class RouterPersistStorage implements PersistStorage {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  get(prefix: string) {
    const data: any = {};
    console.log(location.search);
    const params = new URLSearchParams(location.search);
    console.log(params);
    params.forEach((value, key) => {
      // parse key string and dot set value in data
      const keys = [...key.split('.')];
      let current = data;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          current[key] = current[key] || {};
          current = current[key];
        }
      });
    });
    return data[prefix] || {};
  }

  set(prefix: string, value: any) {
    // flat value object with dot notation
    const data: any = flattenObject(value, `${prefix}.`);
    this.router.navigate([], {
      queryParams: data,
    })
  }
}