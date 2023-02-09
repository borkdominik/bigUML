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
package com.eclipsesource.uml.glsp.core.manifest;

import com.eclipsesource.uml.glsp.core.features.id_generator.IdCountContextGenerator;
import com.eclipsesource.uml.glsp.core.features.label_edit.LabelExtractor;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.Suffix;
import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateHandlerOperationMapper;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.OverrideOperationHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.SuffixIdAppenderContribution;
import com.google.inject.AbstractModule;
import com.google.inject.Binder;
import com.google.inject.Singleton;

public class CoreManifest extends AbstractModule
   implements OverrideOperationHandlerContribution.Definition, SuffixIdAppenderContribution {

   @Override
   protected void configure() {
      super.configure();

      defineOverrideOperationHandlerContribution();

      contributeSuffixIdAppenders((contribution) -> {
         contribution.addBinding(NameLabelSuffix.SUFFIX).to(NameLabelSuffix.class);
      });

      bind(Suffix.class).in(Singleton.class);
      bind(LabelExtractor.class).in(Singleton.class);
      bind(IdCountContextGenerator.class).in(Singleton.class);
      bind(UpdateHandlerOperationMapper.class).in(Singleton.class);
   }

   @Override
   public Binder contributionBinder() {
      return binder();
   }
}
