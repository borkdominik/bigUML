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

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.utils.UmlSemanticUtil;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Injector;

public class ModelContext {
   public final URI uri;
   public final EditingDomain domain;
   public final CCommand command;

   public final Model model;
   public final Map<String, Object> data = new HashMap<>();
   public final Optional<Injector> injector;

   protected ModelContext(final URI uri, final EditingDomain domain, final CCommand command) {
      this(uri, domain, command, null);
   }

   protected ModelContext(final URI uri, final EditingDomain domain, final CCommand command, final Injector injector) {
      super();
      this.uri = uri;
      this.domain = domain;
      this.command = command;

      this.model = UmlSemanticUtil.getModel(this);
      this.injector = Optional.ofNullable(injector);
   }

   public <T> Optional<T> get(final String key, final Class<T> clazz) {
      return Optional.ofNullable(data.get(key)).map(element -> clazz.cast(element));
   }

   public PartialBuilder with() {
      return new PartialBuilder(this);
   }

   public ContributionDecoder decoder() {
      return new ContributionDecoder(this);
   }

   public Representation representation() {
      return decoder().representation().orElseThrow();
   }

   public static ModelContext of(final URI uri, final EditingDomain domain, final CCommand command) {
      return of(uri, domain, command, null);
   }

   public static ModelContext of(final URI uri, final EditingDomain domain, final CCommand command,
      final Injector injector) {
      return new ModelContext(uri, domain, command, injector);
   }

   public static class PartialBuilder {
      protected URI uri;
      protected EditingDomain domain;
      protected CCommand command;

      protected PartialBuilder(final ModelContext context) {
         uri = context.uri;
         domain = context.domain;
         command = context.command;
      }

      public PartialBuilder uri(final URI uri) {
         this.uri = uri;
         return this;
      }

      public PartialBuilder domain(final EditingDomain domain) {
         this.domain = domain;
         return this;
      }

      public PartialBuilder command(final CCommand command) {
         this.command = command;
         return this;
      }

      public ModelContext build() {
         return ModelContext.of(uri, domain, command);
      }
   }
}
