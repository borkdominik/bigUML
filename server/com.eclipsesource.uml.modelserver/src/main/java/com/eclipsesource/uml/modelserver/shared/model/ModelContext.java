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
package com.eclipsesource.uml.modelserver.shared.model;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.shared.utils.UmlSemanticUtil;

public class ModelContext {
   public final URI uri;
   public final EditingDomain domain;
   public final CCommand command;

   public final Model model;
   public final Map<String, Object> data = new HashMap<>();

   protected ModelContext(final URI uri, final EditingDomain domain, final CCommand command) {
      super();
      this.uri = uri;
      this.domain = domain;
      this.command = command;

      this.model = UmlSemanticUtil.getModel(this);
   }

   public <T> Optional<T> get(final String key, final Class<T> clazz) {
      return Optional.ofNullable(data.get(key)).map(element -> clazz.cast(element));
   }

   public static ModelContext of(final URI uri, final EditingDomain domain, final CCommand command) {
      return new ModelContext(uri, domain, command);
   }
}
