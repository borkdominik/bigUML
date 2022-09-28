/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.features.validation.validators;

import java.util.List;

import org.eclipse.uml2.uml.Element;

public interface Validator<T extends Element> {
   ValidatorResult validateName(String elementId, String name);

   ValidatorResult validate(T element);

   List<ValidatorResult> validateWithChildren(T element);
}
