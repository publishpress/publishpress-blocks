#!/usr/bin/env bash

set -euo pipefail

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
SCRIPT_HANDLES="${SCRIPT_HANDLES:-${LANG_SCRIPT_HANDLES:-}}"

if [ -z "$SCRIPT_HANDLES" ]; then
	echo "No SCRIPT_HANDLES found. Set SCRIPT_HANDLES in /project/.env or ./.env"
	exit 1
fi

run_po2json() {
	local po_in="$1" json_out="$2"
	local local_bin="$REPO_ROOT/node_modules/.bin/po2json"
	if [ -x "$local_bin" ]; then
		"$local_bin" "$po_in" "$json_out"
	else
		npx --yes po2json "$po_in" "$json_out"
	fi
}

run_po2json_jed() {
	local po_in="$1" json_out="$2"
	local local_bin="$REPO_ROOT/node_modules/.bin/po2json"
	if [ -x "$local_bin" ]; then
		"$local_bin" "$po_in" "$json_out" -f jed1.x
	else
		npx --yes po2json "$po_in" "$json_out" -f jed1.x
	fi
}

discover_locales() {
	if [ -n "${LANG_LOCALES:-}" ]; then
		echo "$LANG_LOCALES"
		return
	fi

	find "./$LANG_DIR" -maxdepth 1 -type f -name "$TEXT_DOMAIN-*.po" | sed -E "s|.*/$TEXT_DOMAIN-(.*)\.po|\1|" | sort
}

locales="$(discover_locales)"
if [ -z "$locales" ]; then
	echo "No locales found. Set LANG_LOCALES or add .po files in ./$LANG_DIR"
	exit 0
fi

for locale in $locales
do
	po_file="./$LANG_DIR/$TEXT_DOMAIN-${locale}.po"
	if [ -f "$po_file" ]; then
		legacy_json="./$LANG_DIR/$TEXT_DOMAIN-${locale}.json"
		jed_json="./$LANG_DIR/$TEXT_DOMAIN-${locale}.tmp-jed.json"

		# Keep the legacy locale JSON currently used by existing tooling.
		run_po2json "$po_file" "$legacy_json"

		# Generate Jed JSON and map it to known script handles for wp_set_script_translations().
		run_po2json_jed "$po_file" "$jed_json"
		for handle in $SCRIPT_HANDLES
		do
			cp "$jed_json" "./$LANG_DIR/$TEXT_DOMAIN-${locale}-${handle}.json"
		done

		rm -f "$jed_json"
	fi
done