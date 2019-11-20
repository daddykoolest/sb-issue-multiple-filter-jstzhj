import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

/** Constants used to fill up our data base. */
const COLORS = ['Maron', 'Feu', 'Sable', 'Blanc',
  'Roux', 'Ecailles de tortue', 'Bleu', 'Noir', 'Gris'];
const NAMES = ['Maki', 'Cusco', 'Jerk', 'Scampy', 'Yoshi', 'Merlin',
  'Whisky', 'Gaia', 'Simba', 'Nuts'];
const RACES = ['Chien', 'Chat', 'Lapin'];
let j = 1;
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Colonnes à afficher dans cet ordre
  displayedColumns = ['id', 'race', 'name', 'color'];
  pageSizeOptions = [5, 10, 25, 100];

  dataSourceSimple: MatTableDataSource<UserData>;
  dataSource: MatTableDataSource<UserData>;

  constructor() {

    const users: UserData[] = [];
    for (let i = 1; i <= 15; i++) {
      users.push(this.createNewUser(i));
    }
    // Assign the data to the data source for the table to render
    this.dataSourceSimple = new MatTableDataSource(users);
    this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit() {
    this.dataSource.filterPredicate =
      (data: UserData, filters: string) => {
        const matchFilter = [];
        const filterArray = filters.split(' ');
        const columns = (<any>Object).values(data);
        // OR be more specific [data.name, data.race, data.color];

        // Main
        filterArray.forEach(filter => {
          const customFilter = [];
          columns.forEach(column => customFilter.push(column.toLowerCase().includes(filter)));
          matchFilter.push(customFilter.some(Boolean)); // OR
        });
        return matchFilter.every(Boolean); // AND
      }
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSourceSimple.paginator = this.paginator;
    this.dataSourceSimple.sort = this.sort;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    const filters = filterValue.trim().toLowerCase();
    this.dataSource.filter = filters;
  }

  applyFilterSimple(filterValue: string) {
    const filtersSimple = filterValue.trim().toLowerCase();
    this.dataSourceSimple.filter = filtersSimple;
  }

  /** Builds and returns a new User. */
  createNewUser(id: number): UserData {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))];
    const color = COLORS[Math.round(Math.random() * (COLORS.length - 1))];
    const race = RACES[Math.round(Math.random() * (RACES.length - 1))];

    return {
      id: id.toString(),
      name: name,
      race: race,
      color: color
    };
  }
}

export interface UserData {
  id: string;
  name: string;
  race: string;
  color: string;
}
