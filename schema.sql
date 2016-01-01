drop table if exists entries;
create table entries (
  id integer primary key autoincrement,
  entryDate date not null,
  title text not null,
  text text not null
);