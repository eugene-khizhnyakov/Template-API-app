import { ConfigurationDto } from '../dtos/configuration.dto';

export interface IValidationError {
  target: ConfigurationDto | Record<null, null>;
  value: string;
  property: string;
  constraints: Record<string, string>;
}
