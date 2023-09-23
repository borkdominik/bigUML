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
package com.eclipsesource.uml.modelserver.uml.command.update;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.uml.command.UmlCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;

public class UpdateElementCommandContribution extends UmlCommandContribution {

   public static final String TYPE = "uml:update-element";

   @Inject
   protected UpdateCommandProviderRegistry registry;

   public static CCommand create(final Representation representation, final EObject element,
      final Object update) {
      return new ContributionEncoder().type(TYPE).representation(representation).element(element)
         .embedJson(update)
         .ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(ModelContext.of(modelUri, domain, command, injector));
      var representation = decoder.representation().orElseThrow();
      var element = decoder.element(EObject.class).orElseThrow();

      return registry.get(RepresentationKey.of(representation, element.getClass()))
         .orElseThrow(
            () -> {
               registry.printContent();
               return new IllegalArgumentException(
                  String.format("No update command provider found for representation %s and element %s",
                     representation.getName(), element.getClass().getSimpleName()));
            })
         .provideUpdateCommand(decoder.context(), element);
   }
}
