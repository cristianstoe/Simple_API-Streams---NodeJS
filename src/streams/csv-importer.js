import { parse } from "csv-parse";
import fs from "fs";
import { randomUUID } from "crypto";
import { Database } from "../database.js";

const database = new Database();



const csvPath = new URL("../../mig.csv", import.meta.url);

export function csvImporter() {
  fs.createReadStream(csvPath, { encoding: "utf-8" })
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      const [title, description] = row;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)
    })
    .on("error", function (error) {
      console.log(error.message);
    });
}
