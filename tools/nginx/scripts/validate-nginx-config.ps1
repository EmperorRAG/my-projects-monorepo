param(
	[Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)]
	[string[]]$ScenarioNames
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$workspaceRoot = Convert-Path (Get-Location)

function Get-ScenarioDefinition {
	param(
		[string]$Name
	)

	switch ($Name.ToLowerInvariant()) {
		'proxy-edge' {
			return @{
				DisplayName = 'proxy-edge';
				Volumes     = @(
					@{ Source = "$workspaceRoot/tools/nginx/common/base.nginx.conf"; Target = '/etc/nginx/nginx.conf' },
					@{ Source = "$workspaceRoot/tools/nginx/common/snippets"; Target = '/etc/nginx/snippets' },
					@{ Source = "$workspaceRoot/tools/nginx/proxy-edge/nginx.conf"; Target = '/etc/nginx/conf.d/proxy-edge.conf' },
					@{ Source = "$workspaceRoot/tools/nginx/proxy-edge/overlays"; Target = '/etc/nginx/conf.d/overlays' }
				);
				ExtraHosts  = @(
					'lb-frontend=127.0.0.1',
					'lb-api=127.0.0.1',
					'lb-email=127.0.0.1'
				)
			}
		}
		'lb-frontend' {
			return @{
				DisplayName = 'lb-frontend';
				Volumes     = @(
					@{ Source = "$workspaceRoot/tools/nginx/common/base.nginx.conf"; Target = '/etc/nginx/nginx.conf' },
					@{ Source = "$workspaceRoot/tools/nginx/common/snippets"; Target = '/etc/nginx/snippets' },
					@{ Source = "$workspaceRoot/tools/nginx/load-balancers/lb-frontend/nginx.conf"; Target = '/etc/nginx/conf.d/lb-frontend.conf' },
					@{ Source = "$workspaceRoot/tools/nginx/load-balancers/lb-frontend/overlays"; Target = '/etc/nginx/conf.d/overlays' }
				);
				ExtraHosts  = @(
					'my-programs-app=127.0.0.1'
				)
			}
		}
		'lb-api' {
			return @{
				DisplayName = 'lb-api';
				Volumes     = @(
					@{ Source = "$workspaceRoot/tools/nginx/common/base.nginx.conf"; Target = '/etc/nginx/nginx.conf' },
					@{ Source = "$workspaceRoot/tools/nginx/common/snippets"; Target = '/etc/nginx/snippets' },
					@{ Source = "$workspaceRoot/tools/nginx/load-balancers/lb-api/nginx.conf"; Target = '/etc/nginx/conf.d/lb-api.conf' },
					@{ Source = "$workspaceRoot/tools/nginx/load-balancers/lb-api/overlays"; Target = '/etc/nginx/conf.d/overlays' }
				);
				ExtraHosts  = @(
					'my-nest-js-email-microservice=127.0.0.1'
				)
			}
		}
		'lb-email' {
			return @{
				DisplayName = 'lb-email';
				Volumes     = @(
					@{ Source = "$workspaceRoot/tools/nginx/common/base.nginx.conf"; Target = '/etc/nginx/nginx.conf' },
					@{ Source = "$workspaceRoot/tools/nginx/common/snippets"; Target = '/etc/nginx/snippets' },
					@{ Source = "$workspaceRoot/tools/nginx/load-balancers/lb-email/nginx.conf"; Target = '/etc/nginx/conf.d/lb-email.conf' },
					@{ Source = "$workspaceRoot/tools/nginx/load-balancers/lb-email/overlays"; Target = '/etc/nginx/conf.d/overlays' }
				);
				ExtraHosts  = @(
					'my-nest-js-email-microservice=127.0.0.1'
				)
			}
		}
		default {
			throw "Unknown NGINX validation scenario: $Name"
		}
	}
}

if (-not $ScenarioNames -or $ScenarioNames.Count -eq 0) {
	Write-Error 'No scenario names provided to validate.'
	exit 1
}

foreach ($scenarioName in $ScenarioNames) {
	$definition = Get-ScenarioDefinition -Name $scenarioName
	$displayName = $definition.DisplayName

	Write-Host "Validating NGINX configuration scenario: $displayName"

	$dockerArgs = @('run', '--rm')

	foreach ($volume in $definition.Volumes) {
		$sourcePath = Convert-Path $volume.Source
		$dockerArgs += '-v'
		$dockerArgs += "${sourcePath}:$($volume.Target):ro"
	}

	if ($definition.ContainsKey('ExtraHosts')) {
		foreach ($hostMapping in $definition.ExtraHosts) {
			$dockerArgs += '--add-host'
			$dockerArgs += $hostMapping
		}
	}

	$dockerArgs += @('nginx:1.27-alpine', 'nginx', '-t')

	& docker @dockerArgs

	if ($LASTEXITCODE -ne 0) {
		throw "Validation failed for scenario '$displayName' (exit code $LASTEXITCODE)"
	}
}

Write-Host 'All NGINX configuration scenarios validated successfully.'
