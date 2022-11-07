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
package com.eclipsesource.uml.modelserver.uml.generator;

import java.util.stream.Collectors;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.modelserver.shared.utils.UmlSemanticUtil;

public class PackageableElementNameGenerator extends ListNameGenerator {
   public PackageableElementNameGenerator(final Class<? extends PackageableElement> clazz, final URI modelUri,
      final EditingDomain domain) {
      super(clazz, UmlSemanticUtil.getModel(modelUri, domain).getPackagedElements().stream().filter(clazz::isInstance)
         .collect(Collectors.toList()));
   }
}
