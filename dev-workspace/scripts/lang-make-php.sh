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
WP_CLI_PHP="${WP_CLI_PHP:-php}"
WP_CLI_BOOT="${WP_CLI_BOOT:-./vendor/wp-cli/wp-cli/php/boot-fs.php}"

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

count=0
for locale in $locales
do
	po_file="./$LANG_DIR/$TEXT_DOMAIN-${locale}.po"
	l10n_out="./$LANG_DIR/$TEXT_DOMAIN-${locale}.l10n.php"
	if [ -f "$po_file" ]; then
		tmp_dir="./$LANG_DIR/.tmp-l10n-${locale}"
		rm -rf "$tmp_dir"
		mkdir -p "$tmp_dir"

		"$WP_CLI_PHP" "$WP_CLI_BOOT" i18n make-php "$po_file" "$tmp_dir" --allow-root >/dev/null

		generated_file="$(find "$tmp_dir" -maxdepth 1 -type f -name '*.l10n.php' | head -n 1)"
		if [ -n "$generated_file" ] && [ -f "$generated_file" ]; then
			cp "$generated_file" "$l10n_out"
			count=$((count + 1))
		fi

		rm -rf "$tmp_dir"
	fi
done

echo "Generated $count l10n file(s)."
