/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.command.reconnect;

import java.util.List;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.behavior.BehaviorRegistry;
import com.eclipsesource.uml.modelserver.uml.behavior.reconnect.ReconnectBehavior;
import com.eclipsesource.uml.modelserver.uml.command.UmlCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.common.reflect.TypeToken;
import com.google.inject.Inject;
import com.google.inject.TypeLiteral;

public class ReconnectElementCommandContribution extends UmlCommandContribution {

   public static final String TYPE = "uml:reconnect-edge";
   public static final String SOURCES = "sources";
   public static final String TARGETS = "targets";

   @Inject
   protected BehaviorRegistry registry;

   public static CCommand create(final Representation representation, final EObject element,
      final Set<String> sources, final Set<String> targets) {
      return new ContributionEncoder().type(TYPE).representation(representation).element(element)
         .embedJson(SOURCES, sources).embedJson(TARGETS, targets)
         .ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(ModelContext.of(modelUri, domain, command, injector));
      var context = decoder.context();
      var element = decoder.element(EObject.class).orElseThrow();
      var sources = decoder.embedJson(SOURCES, new TypeToken<List<String>>() {});
      var targets = decoder.embedJson(TARGETS, new TypeToken<List<String>>() {});

      return registry
         .access(context.representation(), element.getClass(), new TypeLiteral<ReconnectBehavior<EObject>>() {})
         .reconnect(context, element, sources, targets);
   }
}
