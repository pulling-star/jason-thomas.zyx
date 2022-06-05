CREATE TABLE IF NOT EXISTS entries (
  id integer primary key autoincrement,
  entryDate date not null,
  title text not null,
  text text not null
)

CREATE TABLE IF NOT EXISTS "articles" (
	"id"	integer PRIMARY KEY AUTOINCREMENT,
	"publishDate"	date NOT NULL,
	"link"	text NOT NULL,
	"title"	text NOT NULL,
	"text"	text NOT NULL,
	"interactive"	NUMERIC NOT NULL DEFAULT 0
)
