#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT" || exit 1

if [ -f /project/.env ]; then
	set -a
	# shellcheck source=/dev/null
	source /project/.env
	set +a
elif [ -f "$REPO_ROOT/.env" ]; then
	set -a
	# shellcheck source=/dev/null
	source "$REPO_ROOT/.env"
	set +a
fi

LANG_DIR="${LANG_DIR:-languages}"
TEXT_DOMAIN="$(php -r '$c = @json_decode(file_get_contents("composer.json"), true); echo $c["extra"]["plugin-slug"] ?? "advanced-gutenberg";')"

run_po2json() {
	local po_in="$1" json_out="$2"
	local local_bin="$REPO_ROOT/node_modules/.bin/po2json"
	if [ -x "$local_bin" ]; then
		"$local_bin" "$po_in" "$json_out"
	else
		npx --yes po2json "$po_in" "$json_out"
	fi
}

for locale in $LANG_LOCALES
do
	po_file="./$LANG_DIR/$TEXT_DOMAIN-${locale}.po"
	if [ -f "$po_file" ]; then
		run_po2json "$po_file" "./$LANG_DIR/$TEXT_DOMAIN-${locale}.json"
	fi
done
